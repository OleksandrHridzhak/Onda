import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration constants for the sync server
 */
export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI,
  DB_NAME: 'onda-sync',
  COLLECTION_NAME: 'sync-data',
  
  // Security
  MIN_SECRET_KEY_LENGTH: 8,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  MAX_REQUESTS: 60, // 60 requests per minute
};
