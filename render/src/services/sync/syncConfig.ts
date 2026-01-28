import { db } from '../../db';
import type { SyncConfig, SaveConfigResult } from '../syncTypes';

/**
 * Sync Configuration Management
 * Handles reading and writing sync configuration using Dexie
 */
export class SyncConfigManager {
    /**
     * Get sync configuration from settings
     */
    async getSyncConfig(): Promise<SyncConfig | null> {
        try {
            const settings = await db.settings.get('global');

            if (!settings?.sync) {
                return null;
            }

            return settings.sync;
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
            const settings = await db.settings.get('global');

            if (!settings) {
                return { status: 'error', message: 'Settings not found' };
            }

            const updatedSync = {
                ...settings.sync,
                ...config,
                version: currentVersion,
                lastSync: currentLastSync,
            };

            await db.settings.update('global', { sync: updatedSync });

            return { status: 'success', message: 'Sync config saved' };
        } catch (error) {
            console.error('Error saving sync config:', error);
            return { status: 'error', message: (error as Error).message };
        }
    }
}
