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

            // Map from Dexie schema to SyncConfig
            return {
                enabled: settings.sync.isSyncEnabled,
                serverUrl: settings.sync.syncServerUrl,
                secretKey: settings.sync.syncSecretKey,
                version: settings.sync.version,
                lastSync: settings.sync.lastSync,
                autoSync: settings.sync.autoSync,
                syncInterval: settings.sync.syncInterval,
            };
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

            // Map from SyncConfig to Dexie schema and merge with existing
            const updatedSync = {
                ...settings.sync,
                ...(config.enabled !== undefined && {
                    isSyncEnabled: config.enabled,
                }),
                ...(config.serverUrl !== undefined && {
                    syncServerUrl: config.serverUrl,
                }),
                ...(config.secretKey !== undefined && {
                    syncSecretKey: config.secretKey,
                }),
                ...(config.autoSync !== undefined && {
                    autoSync: config.autoSync,
                }),
                ...(config.syncInterval !== undefined && {
                    syncInterval: config.syncInterval,
                }),
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
