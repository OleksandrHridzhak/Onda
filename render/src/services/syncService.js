import { dbPromise, exportData, importData } from './indexedDB.js';

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
          this.startAutoSync(config.syncInterval || 300000); // Default 5 minutes
        }

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
   * Perform full sync: pull from server, merge, and push if needed
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
      // Step 1: Pull from server
      const pullResult = await this.pullFromServer();

      if (pullResult.status === 'error') {
        this.syncInProgress = false;
        return pullResult;
      }

      // Step 2: If server has newer data, merge it
      if (pullResult.hasNewData) {
        await this.mergeServerData(pullResult.data);
      }

      // Step 3: Push local changes to server
      const pushResult = await this.pushToServer();

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
   * Simple strategy: server data wins (can be improved with conflict resolution)
   */
  async mergeServerData(serverData) {
    try {
      // Import server data into local database
      await importData(serverData);

      // Update local version - use server version if available, otherwise increment local
      if (serverData.version && typeof serverData.version === 'number') {
        this.localVersion = serverData.version;
      } else {
        this.localVersion = this.localVersion + 1;
      }
      this.lastSyncTime = new Date().toISOString();

      return { status: 'success', message: 'Data merged successfully' };
    } catch (error) {
      console.error('Merge error:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Start automatic sync at specified interval
   */
  startAutoSync(intervalMs = 300000) {
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
