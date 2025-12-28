import { MongoClient, Collection, Db } from 'mongodb';
import { config } from '../config/config.js';
import { SyncDocument } from '../types/index.js';

let mongoClient: MongoClient | null = null;
let db: Db | null = null;
let collection: Collection<SyncDocument> | null = null;

/**
 * Initialize MongoDB connection and setup indexes
 */
export async function initMongoDB(): Promise<void> {
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
    collection = db.collection<SyncDocument>(config.COLLECTION_NAME);
    
    // Create index on secretKey for faster queries and enforce uniqueness
    await collection.createIndex({ secretKey: 1 }, { unique: true });
    
    // Schema cleanup: Remove deprecated fields
    const cleanupResult = await collection.updateMany(
      { previousVersion: { $exists: true } } as any,
      { $unset: { previousVersion: "" } }
    );
    
    if (cleanupResult.modifiedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanupResult.modifiedCount} documents (removed deprecated fields)`);
    }
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`   Database: ${config.DB_NAME}`);
    console.log(`   Collection: ${config.COLLECTION_NAME}`);
  } catch (error) {
    const err = error as Error;
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('   Please check your MONGODB_URI connection string.');
    process.exit(1);
  }
}

/**
 * Get MongoDB collection instance
 */
export function getCollection(): Collection<SyncDocument> {
  if (!collection) {
    throw new Error('MongoDB not initialized');
  }
  return collection;
}

/**
 * Get MongoDB client instance
 */
export function getClient(): MongoClient | null {
  return mongoClient;
}

/**
 * Close MongoDB connection gracefully
 */
export async function closeMongoDB(): Promise<void> {
  if (mongoClient) {
    await mongoClient.close();
    console.log('✅ MongoDB connection closed');
  }
}
