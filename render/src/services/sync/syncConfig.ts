import { getDatabase } from '../../database/rxdb';
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
      const doc = await db.settings.findOne('1').exec();
      
      if (!doc) {
        return null;
      }
      
      const settings = doc.toJSON();
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
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();
      
      if (!doc) {
        return { status: 'error', message: 'Settings not found' };
      }

      const settings = doc.toJSON();
      settings.sync = {
        ...settings.sync,
        ...config,
        lastSync: currentLastSync,
        version: currentVersion,
      };

      await doc.update({
        $set: {
          sync: settings.sync,
        },
      });

      return { status: 'success', message: 'Sync config saved' };
    } catch (error) {
      console.error('Error saving sync config:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }
}
