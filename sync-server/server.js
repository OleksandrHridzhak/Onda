import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration constants
const MIN_SECRET_KEY_LENGTH = 8;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

// MongoDB configuration
// Set MONGODB_URI environment variable with your MongoDB Atlas connection string
// Example: mongodb+srv://username:password@cluster.mongodb.net/onda-sync?retryWrites=true&w=majority
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DB_NAME = 'onda-sync';
const COLLECTION_NAME = 'sync-data';

let mongoClient = null;
let db = null;
let collection = null;

// Initialize MongoDB connection
async function initMongoDB() {
  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
    console.error('   Please set MONGODB_URI to your MongoDB Atlas connection string.');
    console.error('   Example: export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/onda-sync"');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    
    // Create index on secretKey for faster queries
    await collection.createIndex({ secretKey: 1 }, { unique: true });
    
    // Clean up old schema fields that are no longer needed
    // Remove 'previousVersion' field from all documents (keep schema clean)
    await collection.updateMany(
      { previousVersion: { $exists: true } },
      { $unset: { previousVersion: "" } }
    );
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   Collection: ${COLLECTION_NAME}`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('   Please check your MONGODB_URI connection string.');
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple rate limiting to prevent abuse
const rateLimitMap = new Map();

const rateLimiter = (req, res, next) => {
  const key = req.headers['x-secret-key'] || req.ip;
  const now = Date.now();
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  const rateData = rateLimitMap.get(key);
  
  if (now > rateData.resetTime) {
    // Reset the counter
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  if (rateData.count >= MAX_REQUESTS) {
    return res.status(429).json({ 
      error: 'Too many requests', 
      retryAfter: Math.ceil((rateData.resetTime - now) / 1000) 
    });
  }
  
  rateData.count++;
  next();
};

// Apply rate limiting to all routes
app.use(rateLimiter);

// Middleware to verify secret key
const authenticateKey = (req, res, next) => {
  const secretKey = req.headers['x-secret-key'];
  if (!secretKey || secretKey.length < MIN_SECRET_KEY_LENGTH) {
    return res.status(401).json({ error: 'Invalid or missing secret key' });
  }
  req.secretKey = secretKey;
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  const isMongoConnected = mongoClient && mongoClient.topology && mongoClient.topology.isConnected();
  res.json({ 
    status: isMongoConnected ? 'ok' : 'degraded',
    mongodb: isMongoConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// Get sync data - pull from server
app.get('/sync/data', authenticateKey, async (req, res) => {
  try {
    const { secretKey } = req;
    const doc = await collection.findOne({ secretKey });

    if (!doc) {
      return res.json({
        exists: false,
        message: 'No data found for this key',
      });
    }

    res.json({
      exists: true,
      data: doc.content,
      lastSync: doc.lastSync,
      version: doc.version,
    });
  } catch (error) {
    console.error('Error getting sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Push sync data to server
app.post('/sync/push', authenticateKey, async (req, res) => {
  try {
    const { secretKey } = req;
    const { data: clientData, clientVersion } = req.body;

    if (!clientData) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Get current server data
    const serverData = await collection.findOne({ secretKey });

    // If no server data exists, this is the first sync
    if (!serverData) {
      const newDoc = {
        secretKey,
        content: clientData,
        lastSync: new Date().toISOString(),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await collection.insertOne(newDoc);

      console.log(`✅ Initial sync - Version: 1`);
      return res.json({
        success: true,
        version: 1,
        lastSync: newDoc.lastSync,
        message: 'Initial sync completed',
      });
    }

    // Simple conflict resolution: last write wins
    // Increment version number for this push
    const newVersion = serverData.version + 1;
    const updateData = {
      content: clientData,
      lastSync: new Date().toISOString(),
      version: newVersion,
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { secretKey },
      { $set: updateData }
    );

    console.log(`✅ Push completed - Client v${clientVersion} → Server v${newVersion}`);
    res.json({
      success: true,
      version: newVersion,
      lastSync: updateData.lastSync,
      message: 'Sync completed',
    });
  } catch (error) {
    console.error('Error pushing sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pull sync data with conflict detection
app.post('/sync/pull', authenticateKey, async (req, res) => {
  try {
    const { secretKey } = req;
    const { clientVersion, clientLastSync } = req.body;

    const serverData = await collection.findOne({ secretKey });

    if (!serverData) {
      console.log(`📥 Pull - No data on server for this key`);
      return res.json({
        exists: false,
        message: 'No data on server',
      });
    }

    // Check if client is up to date
    const hasConflict = clientVersion && clientVersion < serverData.version;
    
    console.log(`📥 Pull - Client v${clientVersion} ← Server v${serverData.version} ${hasConflict ? '(conflict)' : '(up to date)'}`);
    res.json({
      exists: true,
      data: serverData.content,
      version: serverData.version,
      lastSync: serverData.lastSync,
      hasConflict,
      message: hasConflict ? 'Conflict detected' : 'Data up to date',
    });
  } catch (error) {
    console.error('Error pulling sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete sync data (for testing or account cleanup)
app.delete('/sync/data', authenticateKey, async (req, res) => {
  try {
    const { secretKey } = req;
    await collection.deleteOne({ secretKey });

    res.json({ success: true, message: 'Data deleted' });
  } catch (error) {
    console.error('Error deleting sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (mongoClient) {
    await mongoClient.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (mongoClient) {
    await mongoClient.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});

// Initialize and start server
(async () => {
  await initMongoDB();
  
  app.listen(PORT, () => {
    console.log(`🌊 Onda Sync Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Storage: MongoDB Atlas`);
  });
})();
