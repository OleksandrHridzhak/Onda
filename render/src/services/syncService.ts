import { SYNC_AUTO_INTERVAL } from './sync/syncConstants';
import { SyncConfigManager, SyncOperations, SyncStateManager } from './sync';
import type {
  SyncConfig,
  SyncResult,
  TestConnectionResult,
  SyncStatus,
  SaveConfigResult,
  PushResult,
} from './syncTypes';

/**
 * Sync Service - handles synchronization with remote server
 * Local-first approach: always work with local data, sync in background
 *
 * Refactored into modular components:
 * - SyncConfigManager: Configuration management
 * - SyncOperations: Server communication (push/pull/test)
 * - SyncStateManager: State management (version, timers, flags)
 */

class SyncService {
  private configManager: SyncConfigManager;
  private operations: SyncOperations;
  private state: SyncStateManager;

  constructor() {
    this.configManager = new SyncConfigManager();
    this.operations = new SyncOperations();
    this.state = new SyncStateManager();
  }

  /**
   * Initialize sync service with configuration
   */
  async initialize(): Promise<boolean> {
    try {
      const config = await this.getSyncConfig();
      if (config && config.enabled && config.secretKey && config.serverUrl) {
        this.state.syncUrl = config.serverUrl;
        this.state.secretKey = config.secretKey;
        this.state.localVersion = config.version || 0;
        this.state.lastSyncTime = config.lastSync || null;

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
  async getSyncConfig(): Promise<SyncConfig | null> {
    return this.configManager.getSyncConfig();
  }

  /**
   * Save sync configuration to settings
   */
  async saveSyncConfig(config: Partial<SyncConfig>): Promise<SaveConfigResult> {
    const result = await this.configManager.saveSyncConfig(
      config,
      this.state.localVersion,
      this.state.lastSyncTime,
    );

    // Update local state
    if (result.status === 'success') {
      if (config.serverUrl) this.state.syncUrl = config.serverUrl;
      if (config.secretKey) this.state.secretKey = config.secretKey;
    }

    return result;
  }

  /**
   * Perform full sync: push local changes first, then pull server updates
   * Push-first strategy prevents race conditions and data loss
   */
  async sync(force: boolean = false): Promise<SyncResult> {
    if (this.state.syncInProgress && !force) {
      console.log('⏭️ Sync already in progress, skipping');
      return { status: 'skipped', message: 'Sync already in progress' };
    }

    if (!this.state.isConfigured()) {
      return {
        status: 'error',
        message: 'Sync not configured. Please set server URL and secret key.',
      };
    }

    this.state.syncInProgress = true;

    try {
      let pushResult: PushResult = { success: false };

      // Step 1: Push local changes first (if any)
      if (this.state.hasLocalChanges) {
        console.log('⬆️ Pushing local changes to server...');
        pushResult = await this.operations.pushToServer(
          this.state.syncUrl!,
          this.state.secretKey!,
          this.state.localVersion,
        );

        if (pushResult.success) {
          this.state.hasLocalChanges = false;
          this.state.localVersion = pushResult.version!;
          this.state.lastSyncTime =
            pushResult.lastSync || new Date().toISOString();

          await this.configManager.saveSyncConfig(
            {},
            this.state.localVersion,
            this.state.lastSyncTime,
          );

          console.log(
            `✅ Push completed - Client v${(pushResult.version || 1) - 1} → Server v${pushResult.version}`,
          );
        } else {
          console.warn('⚠️ Push failed, continuing with pull...');
        }
      }

      // Step 2: Pull latest data from server
      const pullResult = await this.operations.pullFromServer(
        this.state.syncUrl!,
        this.state.secretKey!,
        this.state.localVersion,
        this.state.lastSyncTime,
      );

      if (pullResult.status === 'error') {
        this.state.syncInProgress = false;
        return {
          status: 'error',
          message: pullResult.message || 'Pull failed',
        };
      }

      // Step 3: Merge if server has newer data
      if (pullResult.hasNewData) {
        console.log('🔄 Merging newer server data...');
        await this.operations.mergeServerData(
          pullResult.data,
          pullResult.version || 0,
        );

        this.state.localVersion = pullResult.version || 0;
        this.state.lastSyncTime = new Date().toISOString();

        await this.configManager.saveSyncConfig(
          {},
          this.state.localVersion,
          this.state.lastSyncTime,
        );

        console.log(
          `📥 Merge completed - Client v${this.state.localVersion - 1} → v${this.state.localVersion}`,
        );
      } else {
        console.log(
          `📥 Pull - Client v${this.state.localVersion} ← Server v${pullResult.version || this.state.localVersion} (up to date)`,
        );
      }

      this.state.syncInProgress = false;

      return {
        status: 'success',
        message: 'Sync completed successfully',
        pulled: pullResult.hasNewData,
        pushed: pushResult.success,
        version: this.state.localVersion,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.state.syncInProgress = false;
      console.error('❌ Sync error:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }

  /**
   * Start automatic sync at specified interval
   */
  startAutoSync(intervalMs: number = SYNC_AUTO_INTERVAL): void {
    this.state.startAutoSync(() => this.sync(), intervalMs);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    this.state.stopAutoSync();
  }

  /**
   * Trigger debounced sync - syncs after user stops making changes
   * Creates Notion-like experience where changes sync automatically
   */
  triggerDebouncedSync(): void {
    this.state.scheduleDebouncedSync(() => this.sync().catch(console.error));
  }

  /**
   * Cancel any pending debounced sync
   */
  cancelDebouncedSync(): void {
    this.state.cancelDebouncedSync();
  }

  /**
   * Test connection to sync server
   */
  async testConnection(
    serverUrl: string,
    secretKey: string,
  ): Promise<TestConnectionResult> {
    return this.operations.testConnection(serverUrl, secretKey);
  }

  /**
   * Get sync status
   */
  getStatus(): SyncStatus {
    return this.state.getStatus();
  }
}

// Create singleton instance
export const syncService = new SyncService();

/**
 * Notify sync service that data has changed.
 * Backwards-compatible helper for `notifyDataChange()` consumers.
 */
export function notifyDataChange(): void {
  syncService.triggerDebouncedSync();
}
