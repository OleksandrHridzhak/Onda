/**
 * Sync Service Configuration Constants
 * Centralized configuration for sync behavior
 * Update these values to customize sync behavior in your deployment
 */

// Server Configuration
// Change this to your production server URL when deploying
// Example: 'https://onda-sync.render.com' or 'https://your-domain.com'
export const DEFAULT_SYNC_SERVER_URL = 'http://localhost:3001';

// Sync Timing Configuration
export const SYNC_DEBOUNCE_DELAY = 1000; // Wait 1 second after last change before syncing
export const SYNC_AUTO_INTERVAL = 300000; // Auto-sync every 5 minutes (background sync)
export const SYNC_STATUS_UPDATE_INTERVAL = 2000; // Update UI status every 2 seconds

// Security Configuration
export const MIN_SECRET_KEY_LENGTH = 8; // Minimum length for secret keys
export const GENERATED_SECRET_KEY_LENGTH = 16; // Length for auto-generated keys
