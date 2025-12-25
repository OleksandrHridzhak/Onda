import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple rate limiting to prevent abuse
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

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

// In-memory storage (can be replaced with a database if needed)
const syncData = new Map();
const DATA_DIR = join(__dirname, 'data');

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

// Helper function to get data file path
const getDataPath = (secretKey) => join(DATA_DIR, `${secretKey}.json`);

// Load existing data from file if exists
const loadData = async (secretKey) => {
  try {
    const dataPath = getDataPath(secretKey);
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

// Save data to file
const saveData = async (secretKey, data) => {
  try {
    const dataPath = getDataPath(secretKey);
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Middleware to verify secret key
const authenticateKey = (req, res, next) => {
  const secretKey = req.headers['x-secret-key'];
  if (!secretKey || secretKey.length < 8) {
    return res.status(401).json({ error: 'Invalid or missing secret key' });
  }
  req.secretKey = secretKey;
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get sync data - pull from server
app.get('/sync/data', authenticateKey, async (req, res) => {
  try {
    const { secretKey } = req;
    let data = syncData.get(secretKey);

    // If not in memory, try loading from file
    if (!data) {
      data = await loadData(secretKey);
      if (data) {
        syncData.set(secretKey, data);
      }
    }

    if (!data) {
      return res.json({
        exists: false,
        message: 'No data found for this key',
      });
    }

    res.json({
      exists: true,
      data: data.content,
      lastSync: data.lastSync,
      version: data.version,
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
    let serverData = syncData.get(secretKey) || (await loadData(secretKey));

    // If no server data exists, this is the first sync
    if (!serverData) {
      serverData = {
        content: clientData,
        lastSync: new Date().toISOString(),
        version: 1,
      };
      syncData.set(secretKey, serverData);
      await saveData(secretKey, serverData);

      return res.json({
        success: true,
        version: serverData.version,
        lastSync: serverData.lastSync,
        message: 'Initial sync completed',
      });
    }

    // Simple conflict resolution: last write wins
    // In production, more sophisticated conflict logic can be added
    const newVersion = serverData.version + 1;
    serverData = {
      content: clientData,
      lastSync: new Date().toISOString(),
      version: newVersion,
      previousVersion: serverData.version,
    };

    syncData.set(secretKey, serverData);
    await saveData(secretKey, serverData);

    res.json({
      success: true,
      version: newVersion,
      lastSync: serverData.lastSync,
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

    let serverData = syncData.get(secretKey) || (await loadData(secretKey));

    if (!serverData) {
      return res.json({
        exists: false,
        message: 'No data on server',
      });
    }

    // Check if client is up to date
    const hasConflict = clientVersion && clientVersion < serverData.version;

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
// Note: Rate limiting is applied globally via app.use(rateLimiter) middleware
app.delete('/sync/data', authenticateKey, async (req, res) => {
  try {
    const { secretKey } = req;
    syncData.delete(secretKey);

    try {
      await fs.unlink(getDataPath(secretKey));
    } catch (error) {
      // File might not exist, ignore error
    }

    res.json({ success: true, message: 'Data deleted' });
  } catch (error) {
    console.error('Error deleting sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌊 Onda Sync Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
