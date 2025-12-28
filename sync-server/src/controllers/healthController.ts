import { Request, Response } from 'express';
import { getClient } from '../database/mongodb.js';

/**
 * Health check endpoint
 */
export function getHealth(req: Request, res: Response): void {
  const mongoClient = getClient();
  // Check if mongo client exists and has a valid topology
  const isMongoConnected = Boolean(
    mongoClient && 
    (mongoClient as any).topology && 
    (mongoClient as any).topology.isConnected()
  );
  
  res.json({ 
    status: isMongoConnected ? 'ok' : 'degraded',
    mongodb: isMongoConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
}
