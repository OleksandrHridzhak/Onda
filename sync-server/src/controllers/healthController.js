import { getClient } from '../database/mongodb.js';

/**
 * Health check endpoint
 */
export function getHealth(req, res) {
  const mongoClient = getClient();
  const isMongoConnected = mongoClient && mongoClient.topology && mongoClient.topology.isConnected();
  
  res.json({ 
    status: isMongoConnected ? 'ok' : 'degraded',
    mongodb: isMongoConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
}
