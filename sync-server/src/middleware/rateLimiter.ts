import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';
import { RateLimitData } from '../types/index.js';

/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per key/IP
 */
const rateLimitMap = new Map<string, RateLimitData>();

export function rateLimiter(req: Request, res: Response, next: NextFunction): void | Response {
  const key = (req.headers['x-secret-key'] as string) || req.ip || 'unknown';
  const now = Date.now();
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.RATE_LIMIT_WINDOW });
    return next();
  }
  
  const rateData = rateLimitMap.get(key)!;
  
  // Reset counter if window expired
  if (now > rateData.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.RATE_LIMIT_WINDOW });
    return next();
  }
  
  // Check if limit exceeded
  if (rateData.count >= config.MAX_REQUESTS) {
    return res.status(429).json({ 
      error: 'Too many requests', 
      retryAfter: Math.ceil((rateData.resetTime - now) / 1000) 
    });
  }
  
  rateData.count++;
  next();
}
