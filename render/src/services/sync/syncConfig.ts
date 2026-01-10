import { getDatabase } from '../../database/index';
import type { SyncConfig, SaveConfigResult } from '../syncTypes';

/**
 * Sync Configuration Management
 * Handles reading and writing sync configuration to RxDB
 */
export class SyncConfigManager {
  /**
   * Get sync configuration from settings
   */
  async getSyncConfig(): Promise<SyncConfig | null> {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('appSettings').exec();
      return doc?.sync || null;
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
      const db = await getDatabase();
      const doc = await db.settings.findOne('appSettings').exec();

      const currentSync = doc?.sync || {};
      const newSync = {
        ...currentSync,
        ...config,
        lastSync: currentLastSync,
        version: currentVersion,
      };

      if (doc) {
        await doc.patch({
          sync: newSync,
          updatedAt: Date.now(),
        });
      } else {
        await db.settings.insert({
          id: 'appSettings',
          theme: {
            darkMode: false,
            accentColor: 'blue',
            autoThemeSettings: {
              enabled: false,
              startTime: '08:00',
              endTime: '20:00',
            },
          },
          table: {
            showSummaryRow: false,
            compactMode: false,
            stickyHeader: true,
          },
          ui: {
            animations: true,
            tooltips: true,
            confirmDelete: true,
          },
          sync: newSync,
          updatedAt: Date.now(),
        });
      }

      return { status: 'success', message: 'Sync config saved' };
    } catch (error) {
      console.error('Error saving sync config:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }
}
