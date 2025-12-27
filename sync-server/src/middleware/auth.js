import { config } from '../config/config.js';

/**
 * Authentication middleware
 * Verifies secret key is present and meets minimum length requirement
 */
export function authenticateKey(req, res, next) {
  const secretKey = req.headers['x-secret-key'];
  
  if (!secretKey || secretKey.length < config.MIN_SECRET_KEY_LENGTH) {
    return res.status(401).json({ error: 'Invalid or missing secret key' });
  }
  
  req.secretKey = secretKey;
  next();
}
