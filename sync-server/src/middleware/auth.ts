import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';

/**
 * Extended request with secretKey
 */
export interface AuthRequest extends Request {
  secretKey?: string;
}

/**
 * Authentication middleware
 * Verifies secret key is present and meets minimum length requirement
 */
export function authenticateKey(req: AuthRequest, res: Response, next: NextFunction): void | Response {
  const secretKey = req.headers['x-secret-key'] as string;
  
  if (!secretKey || secretKey.length < config.MIN_SECRET_KEY_LENGTH) {
    return res.status(401).json({ error: 'Invalid or missing secret key' });
  }
  
  req.secretKey = secretKey;
  next();
}
