import { config } from '../config/config.js';

/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per key/IP
 */
const rateLimitMap = new Map();

export function rateLimiter(req, res, next) {
  const key = req.headers['x-secret-key'] || req.ip;
  const now = Date.now();
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.RATE_LIMIT_WINDOW });
    return next();
  }
  
  const rateData = rateLimitMap.get(key);
  
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
