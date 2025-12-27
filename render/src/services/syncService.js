import { dbPromise, exportData, importData } from './indexedDB.js';
import {
  DEFAULT_SYNC_SERVER_URL,
  SYNC_DEBOUNCE_DELAY,
  SYNC_AUTO_INTERVAL,
} from './syncConstants.js';

/**
 * Sync Service - handles synchronization with remote server
 * Local-first approach: always work with local data, sync in background
 */

class SyncService {
  constructor() {
    this.syncInProgress = false;
    this.syncInterval = null;
    this.syncUrl = null;
    this.secretKey = null;
    this.localVersion = 0;
    this.lastSyncTime = null;
    this.debouncedSyncTimeout = null;
    this.debounceDelay = SYNC_DEBOUNCE_DELAY;
    this.hasLocalChanges = false; // Track if local data has changed since last sync
  }

  /**
   * Initialize sync service with configuration
   */
  async initialize() {
    try {
      const config = await this.getSyncConfig();
      if (config && config.enabled && config.secretKey && config.serverUrl) {
        this.syncUrl = config.serverUrl;
        this.secretKey = config.secretKey;
        this.localVersion = config.version || 0;
        this.lastSyncTime = config.lastSync || null;

        // Start automatic sync if enabled
        if (config.autoSync) {
          this.startAutoSync(config.syncInterval || SYNC_AUTO_INTERVAL);
        }

        // Pull data on initialization (app open)
        await this.sync();

        console.log('Sync service initialized');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
      return false;
    }
  }

  /**
   * Get sync configuration from settings
   */
  async getSyncConfig() {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const settings = await store.get(1);

      return settings?.sync || null;
    } catch (error) {
      console.error('Error getting sync config:', error);
      return null;
    }
  }

  /**
   * Save sync configuration to settings
   */
  async saveSyncConfig(config) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const settings = (await store.get(1)) || { id: 1 };

      settings.sync = {
        ...settings.sync,
        ...config,
        lastSync: this.lastSyncTime,
        version: this.localVersion,
      };

      await store.put(settings);
      await tx.done;

      // Update local state
      if (config.serverUrl) this.syncUrl = config.serverUrl;
      if (config.secretKey) this.secretKey = config.secretKey;

      return { status: 'success', message: 'Sync config saved' };
    } catch (error) {
      console.error('Error saving sync config:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Perform full sync: push local changes first, then pull server updates
   */
  async sync(force = false) {
    if (this.syncInProgress && !force) {
      console.log('Sync already in progress');
      return { status: 'skipped', message: 'Sync already in progress' };
    }

    if (!this.syncUrl || !this.secretKey) {
      return {
        status: 'error',
        message: 'Sync not configured. Please set server URL and secret key.',
      };
    }

    this.syncInProgress = true;

    try {
      let pushResult = { success: false };
      
      // Step 1: If we have local changes, push them first
      // This prevents local changes from being overwritten by stale server data
      if (this.hasLocalChanges) {
        console.log('Pushing local changes to server...');
        pushResult = await this.pushToServer();
        
        if (pushResult.success) {
          this.hasLocalChanges = false; // Clear the flag after successful push
        }
      }

      // Step 2: Always pull to get latest data from server
      // This ensures we have the most recent data from other devices
      console.log('Pulling latest data from server...');
      const pullResult = await this.pullFromServer();

      if (pullResult.status === 'error') {
        this.syncInProgress = false;
        return pullResult;
      }

      // Step 3: If server has newer data than us, merge it
      // This only happens if another device pushed while we weren't looking
      if (pullResult.hasNewData) {
        console.log('Merging newer server data...');
        await this.mergeServerData(pullResult.data, pullResult.version);
      }

      this.syncInProgress = false;

      return {
        status: 'success',
        message: 'Sync completed successfully',
        pulled: pullResult.hasNewData,
        pushed: pushResult.success,
        version: this.localVersion,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.syncInProgress = false;
      console.error('Sync error:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Pull data from server
   */
  async pullFromServer() {
    try {
      const response = await fetch(`${this.syncUrl}/sync/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': this.secretKey,
        },
        body: JSON.stringify({
          clientVersion: this.localVersion,
          clientLastSync: this.lastSyncTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.exists) {
        return { status: 'success', hasNewData: false };
      }

      // Check if server has newer data
      const hasNewData = result.version > this.localVersion;

      return {
        status: 'success',
        hasNewData,
        data: result.data,
        version: result.version,
        hasConflict: result.hasConflict,
      };
    } catch (error) {
      console.error('Pull error:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Push local data to server
   */
  async pushToServer() {
    try {
      // Export all local data
      const localData = await exportData();

      const response = await fetch(`${this.syncUrl}/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': this.secretKey,
        },
        body: JSON.stringify({
          data: localData,
          clientVersion: this.localVersion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        this.localVersion = result.version;
        this.lastSyncTime = result.lastSync;

        // Save updated version to config
        await this.saveSyncConfig({
          version: this.localVersion,
          lastSync: this.lastSyncTime,
        });

        return { success: true, version: result.version };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error('Push error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Merge server data with local data
   * Server data wins when versions differ (last write wins strategy)
   */
  async mergeServerData(serverData, serverVersion) {
    try {
      // Import server data into local database
      await importData(serverData);

      // Update local version to match server
      this.localVersion = serverVersion;
      this.lastSyncTime = new Date().toISOString();

      // Save updated version to config
      await this.saveSyncConfig({
        version: this.localVersion,
        lastSync: this.lastSyncTime,
      });

      return { status: 'success', message: 'Data merged successfully' };
    } catch (error) {
      console.error('Merge error:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Start automatic sync at specified interval
   */
  startAutoSync(intervalMs = SYNC_AUTO_INTERVAL) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      console.log('Auto-sync triggered');
      this.sync();
    }, intervalMs);

    console.log(`Auto-sync started with interval: ${intervalMs}ms`);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  /**
   * Trigger debounced sync - syncs after user stops making changes
   * This creates a Notion-like experience where changes sync automatically
   */
  triggerDebouncedSync() {
    // Mark that we have local changes that need to be pushed
    this.hasLocalChanges = true;
    
    // Clear any existing timeout
    if (this.debouncedSyncTimeout) {
      clearTimeout(this.debouncedSyncTimeout);
    }

    // Only debounce if sync is enabled
    if (!this.syncUrl || !this.secretKey) {
      return;
    }

    // Set new timeout - sync after user stops editing for debounceDelay ms
    this.debouncedSyncTimeout = setTimeout(() => {
      console.log('Debounced sync triggered (local changes detected)');
      this.sync().catch(console.error);
    }, this.debounceDelay);
  }

  /**
   * Cancel any pending debounced sync
   */
  cancelDebouncedSync() {
    if (this.debouncedSyncTimeout) {
      clearTimeout(this.debouncedSyncTimeout);
      this.debouncedSyncTimeout = null;
    }
  }

  /**
   * Test connection to sync server
   */
  async testConnection(serverUrl, secretKey) {
    try {
      const response = await fetch(`${serverUrl}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        return { status: 'error', message: 'Server not responding' };
      }

      const result = await response.json();

      // Test authentication
      const authTest = await fetch(`${serverUrl}/sync/data`, {
        method: 'GET',
        headers: {
          'x-secret-key': secretKey,
        },
      });

      if (authTest.status === 401) {
        return {
          status: 'error',
          message: 'Invalid secret key (must be at least 8 characters)',
        };
      }

      return {
        status: 'success',
        message: 'Connection successful',
        serverStatus: result.status,
      };
    } catch (error) {
      console.error('Connection test error:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      enabled: !!(this.syncUrl && this.secretKey),
      syncing: this.syncInProgress,
      version: this.localVersion,
      lastSync: this.lastSyncTime,
      autoSyncActive: !!this.syncInterval,
    };
  }
}

// Create singleton instance
export const syncService = new SyncService();
