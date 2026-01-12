import { SYNC_DEBOUNCE_DELAY, SYNC_AUTO_INTERVAL } from './syncConstants';
import type { SyncStatus } from '../syncTypes';

/**
 * Sync State Management
 * Manages sync service state (version, timers, flags)
 */
export class SyncStateManager {
  syncInProgress = false;
  syncUrl: string | null = null;
  secretKey: string | null = null;
  localVersion = 0;
  lastSyncTime: string | null = null;
  hasLocalChanges = false;
  readonly debounceDelay = SYNC_DEBOUNCE_DELAY;

  private syncInterval: NodeJS.Timeout | null = null;
  private debouncedSyncTimeout: NodeJS.Timeout | null = null;

  isConfigured(): boolean {
    return !!(this.syncUrl && this.secretKey);
  }

  /**
   * Start automatic sync at specified interval
   */
  startAutoSync(
    syncCallback: () => void,
    intervalMs: number = SYNC_AUTO_INTERVAL,
  ): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      console.log('Auto-sync triggered');
      syncCallback();
    }, intervalMs);

    console.log(`Auto-sync started with interval: ${intervalMs}ms`);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  /**
   * Schedule debounced sync
   */
  scheduleDebouncedSync(syncCallback: () => void): void {
    // Mark that we have local changes needing push
    this.hasLocalChanges = true;

    // Clear any existing timeout (reset debounce timer)
    if (this.debouncedSyncTimeout) {
      clearTimeout(this.debouncedSyncTimeout);
    }

    // Only sync if properly configured
    if (!this.isConfigured()) {
      return;
    }

    // Sync after user stops editing for debounceDelay ms
    this.debouncedSyncTimeout = setTimeout(() => {
      console.log('⏱️ Debounced sync triggered (local changes detected)');
      syncCallback();
    }, this.debounceDelay);
  }

  /**
   * Cancel any pending debounced sync
   */
  cancelDebouncedSync(): void {
    if (this.debouncedSyncTimeout) {
      clearTimeout(this.debouncedSyncTimeout);
      this.debouncedSyncTimeout = null;
    }
  }

  /**
   * Get sync status
   */
  getStatus(): SyncStatus {
    return {
      enabled: this.isConfigured(),
      syncing: this.syncInProgress,
      version: this.localVersion,
      lastSync: this.lastSyncTime,
      autoSyncActive: !!this.syncInterval,
    };
  }

  /**
   * Cleanup all timers
   */
  cleanup(): void {
    this.stopAutoSync();
    this.cancelDebouncedSync();
  }
}
