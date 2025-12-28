import { dbPromise } from '../indexedDB.js';
import type { SyncConfig, SaveConfigResult } from '../syncTypes';

/**
 * Sync Configuration Management
 * Handles reading and writing sync configuration to IndexedDB
 */
export class SyncConfigManager {
  /**
   * Get sync configuration from settings
   */
  async getSyncConfig(): Promise<SyncConfig | null> {
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
  async saveSyncConfig(
    config: Partial<SyncConfig>,
    currentVersion: number,
    currentLastSync: string | null,
  ): Promise<SaveConfigResult> {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const settings = (await store.get(1)) || { id: 1 };

      settings.sync = {
        ...settings.sync,
        ...config,
        lastSync: currentLastSync,
        version: currentVersion,
      };

      await store.put(settings);
      await tx.done;

      return { status: 'success', message: 'Sync config saved' };
    } catch (error) {
      console.error('Error saving sync config:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }
}
