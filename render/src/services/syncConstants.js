/**
 * Sync Service Configuration Constants
 * Centralized configuration for the sync service
 */

// Default sync server URL
// Change this to your production server URL when deploying
export const DEFAULT_SYNC_SERVER_URL = 'http://localhost:3001';

// Sync timing configuration
export const SYNC_DEBOUNCE_DELAY = 1000; // 1 second delay after last change
export const SYNC_AUTO_INTERVAL = 300000; // 5 minutes auto-sync interval
export const SYNC_STATUS_UPDATE_INTERVAL = 2000; // Update status every 2 seconds

// Secret key configuration
export const MIN_SECRET_KEY_LENGTH = 8;
export const GENERATED_SECRET_KEY_LENGTH = 16;
