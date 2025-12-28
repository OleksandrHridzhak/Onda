import { SYNC_DEBOUNCE_DELAY, SYNC_AUTO_INTERVAL } from '../syncConstants';
import type { SyncStatus } from '../syncTypes';

/**
 * Sync State Management
 * Manages sync service state (version, timers, flags)
 */
export class SyncStateManager {
  private syncInProgress: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private syncUrl: string | null = null;
  private secretKey: string | null = null;
  private localVersion: number = 0;
  private lastSyncTime: string | null = null;
  private debouncedSyncTimeout: NodeJS.Timeout | null = null;
  private readonly debounceDelay: number = SYNC_DEBOUNCE_DELAY;
  private hasLocalChanges: boolean = false;

  // Getters
  isSyncInProgress(): boolean {
    return this.syncInProgress;
  }

  setSyncInProgress(value: boolean): void {
    this.syncInProgress = value;
  }

  getSyncUrl(): string | null {
    return this.syncUrl;
  }

  setSyncUrl(url: string | null): void {
    this.syncUrl = url;
  }

  getSecretKey(): string | null {
    return this.secretKey;
  }

  setSecretKey(key: string | null): void {
    this.secretKey = key;
  }

  getLocalVersion(): number {
    return this.localVersion;
  }

  setLocalVersion(version: number): void {
    this.localVersion = version;
  }

  getLastSyncTime(): string | null {
    return this.lastSyncTime;
  }

  setLastSyncTime(time: string | null): void {
    this.lastSyncTime = time;
  }

  hasUnsavedChanges(): boolean {
    return this.hasLocalChanges;
  }

  setHasLocalChanges(value: boolean): void {
    this.hasLocalChanges = value;
  }

  getDebounceDelay(): number {
    return this.debounceDelay;
  }

  isConfigured(): boolean {
    return !!(this.syncUrl && this.secretKey);
  }

  /**
   * Start automatic sync at specified interval
   */
  startAutoSync(syncCallback: () => void, intervalMs: number = SYNC_AUTO_INTERVAL): void {
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
