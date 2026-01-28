import { db } from '../index';
import { Setting } from '../../types/settings.types';
import { DbResult } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

/**
 * Get all settings from the database
 * @returns DbResult with settings object
 * @example
 * // Success:
 * { success: true, data: { id: 'global', columnsOrder: [...], darkMode: false, sync: {...} } }
 *
 * // Not found:
 * { success: false, error: 'Settings not found' }
 *
 * // Error:
 * { success: false, error: 'Database connection failed' }
 */
export async function getSettings(): Promise<DbResult<Setting>> {
    try {
        const data = await db.settings.get('global');
        if (!data) {
            return { success: false, error: 'Settings not found' };
        }
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Update settings with partial data
 * @param updates - Partial settings object to merge
 * @returns DbResult with updated count
 * @example
 * // Success:
 * { success: true, data: { updatedCount: 1 } }
 *
 * // Update sync settings:
 * await updateSettings({ sync: { enabled: true, serverUrl: 'https://...' } })
 *
 * // Error:
 * { success: false, error: 'Update failed' }
 */
export async function updateSettings(
    updates: Partial<Omit<Setting, 'id'>>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        const updatedCount = await db.settings.update('global', updates);

        if (updatedCount === 0) {
            return { success: false, error: 'Settings not found' };
        }

        console.log('[Onda DB] Settings updated:', Object.keys(updates));
        return { success: true, data: { updatedCount } };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Update ONLY the columns order
 * @param columnIds - Array of column IDs in desired order
 * @returns DbResult with updated columnsOrder
 * @example
 * // Success:
 * { success: true, data: { columnsOrder: ['id1', 'id2', 'id3'] } }
 *
 * // Error:
 * { success: false, error: 'Failed to update columns order' }
 */
export async function updateColumnsOrder(
    columnIds: string[],
): Promise<DbResult<{ columnsOrder: string[] }>> {
    try {
        await db.settings.update('global', {
            'layout.columnsOrder': columnIds,
        });
        console.log('[Onda DB] Columns order updated successfully');
        return { success: true, data: { columnsOrder: columnIds } };
    } catch (error) {
        console.error('Failed to update columns order:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Retrieve the current columns order from settings
 * @returns DbResult with array of column IDs
 * @example
 * // Success:
 * { success: true, data: ['id1', 'id2', 'id3'] }
 *
 * // Error:
 * { success: false, error: 'Failed to get columns order' }
 */
export async function getColumnsOrder(): Promise<DbResult<string[]>> {
    try {
        const settings = await db.settings.get('global');
        const data = settings?.layout.columnsOrder || [];
        return { success: true, data };
    } catch (error) {
        console.error('Failed to get columns order:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Clear all data from the database (columns, calendar, settings)
 * WARNING: This will delete all user data! Settings will be reset to defaults.
 * @returns DbResult with counts of deleted items
 * @example
 * // Success:
 * { success: true, data: { deletedColumns: 5, deletedEvents: 12, resetSettings: true } }
 *
 * // Error:
 * { success: false, error: 'Failed to clear data' }
 */
export async function clearAllData(): Promise<
    DbResult<{
        deletedColumns: number;
        deletedEvents: number;
        resetSettings: boolean;
    }>
> {
    try {
        return await db.transaction(
            'rw',
            [db.tableColumns, db.calendar, db.settings],
            async () => {
                // 1. Count items before deletion for logging
                const columnsCount = await db.tableColumns.count();
                const eventsCount = await db.calendar.count();

                // 2. Clear all columns
                await db.tableColumns.clear();

                // 3. Clear all calendar events
                await db.calendar.clear();

                // 4. Reset settings to default
                await db.settings.clear();
                await db.settings.add(DEFAULT_SETTINGS);

                console.log(
                    `[Onda DB] All data cleared: ${columnsCount} columns, ${eventsCount} events`,
                );

                return {
                    success: true,
                    data: {
                        deletedColumns: columnsCount,
                        deletedEvents: eventsCount,
                        resetSettings: true,
                    },
                };
            },
        );
    } catch (error) {
        console.error('[Onda DB] Failed to clear all data:', error);
        return { success: false, error: (error as Error).message };
    }
}
