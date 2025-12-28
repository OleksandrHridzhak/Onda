import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration interface
 */
export interface Config {
  PORT: number;
  MONGODB_URI: string | undefined;
  DB_NAME: string;
  COLLECTION_NAME: string;
  MIN_SECRET_KEY_LENGTH: number;
  RATE_LIMIT_WINDOW: number;
  MAX_REQUESTS: number;
}

/**
 * Configuration constants for the sync server
 */
export const config: Config = {
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  
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
