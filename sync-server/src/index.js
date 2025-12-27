import { config } from './config/config.js';
import { initMongoDB, closeMongoDB } from './database/mongodb.js';
import { createApp } from './app.js';

/**
 * Graceful shutdown handler
 */
async function handleShutdown() {
  console.log('\n🛑 Shutting down gracefully...');
  await closeMongoDB();
  process.exit(0);
}

/**
 * Initialize and start server
 */
async function startServer() {
  // Initialize MongoDB connection
  await initMongoDB();
  
  // Create Express app
  const app = createApp();
  
  // Start listening
  app.listen(config.PORT, () => {
    console.log(`🌊 Onda Sync Server running on port ${config.PORT}`);
    console.log(`   Health check: http://localhost:${config.PORT}/health`);
    console.log(`   Storage: MongoDB Atlas`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
