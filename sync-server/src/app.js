import express from 'express';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

/**
 * Create and configure Express application
 */
export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(rateLimiter);

  // Routes
  app.use(routes);

  return app;
}
