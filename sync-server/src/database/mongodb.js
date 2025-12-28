import { MongoClient } from 'mongodb';
import { config } from '../config/config.js';

let mongoClient = null;
let db = null;
let collection = null;

/**
 * Initialize MongoDB connection and setup indexes
 */
export async function initMongoDB() {
  if (!config.MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
    console.error('   Please set MONGODB_URI to your MongoDB Atlas connection string.');
    console.error('   Example: export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/onda-sync"');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    mongoClient = new MongoClient(config.MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(config.DB_NAME);
    collection = db.collection(config.COLLECTION_NAME);
    
    // Create index on secretKey for faster queries and enforce uniqueness
    await collection.createIndex({ secretKey: 1 }, { unique: true });
    
    // Schema cleanup: Remove deprecated fields
    const cleanupResult = await collection.updateMany(
      { previousVersion: { $exists: true } },
      { $unset: { previousVersion: "" } }
    );
    
    if (cleanupResult.modifiedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanupResult.modifiedCount} documents (removed deprecated fields)`);
    }
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`   Database: ${config.DB_NAME}`);
    console.log(`   Collection: ${config.COLLECTION_NAME}`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('   Please check your MONGODB_URI connection string.');
    process.exit(1);
  }
}

/**
 * Get MongoDB collection instance
 */
export function getCollection() {
  if (!collection) {
    throw new Error('MongoDB not initialized');
  }
  return collection;
}

/**
 * Get MongoDB client instance
 */
export function getClient() {
  return mongoClient;
}

/**
 * Close MongoDB connection gracefully
 */
export async function closeMongoDB() {
  if (mongoClient) {
    await mongoClient.close();
    console.log('✅ MongoDB connection closed');
  }
}
