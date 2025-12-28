/**
 * DEPRECATED: This file is kept for backward compatibility only.
 * 
 * The server code has been refactored following MVC architecture.
 * Please use the new entry point: src/index.js
 * 
 * Run: npm start (which now uses src/index.js)
 */

console.warn('⚠️  WARNING: server.js is deprecated!');
console.warn('   The code has been refactored to MVC structure.');
console.warn('   New entry point: src/index.js');
console.warn('   Please use: npm start');
console.warn('');

// Import and start the new server
import('./src/index.js');
