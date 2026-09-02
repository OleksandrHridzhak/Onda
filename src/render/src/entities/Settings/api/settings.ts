import { getTable, type DbResult } from 'shared/api/db';
import { DEFAULT_SETTINGS } from '../model/defaults';
import type { Setting } from '../model/types';

const settingsTable = getTable<Setting>('settings');

export async function ensureDefaultSettings(): Promise<void> {
    if (!(await settingsTable.get('global'))) {
        await settingsTable.add(DEFAULT_SETTINGS);
    }
}

export async function getSettings(): Promise<DbResult<Setting>> {
    try {
        const data = await settingsTable.get('global');

        return data
            ? { success: true, data }
            : { success: false, error: 'Settings not found' };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function updateSettings(
    updates: Partial<Omit<Setting, 'id'>>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        const updatedCount = await settingsTable.update('global', updates);

        return updatedCount
            ? { success: true, data: { updatedCount } }
            : { success: false, error: 'Settings not found' };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function updateColumnsOrder(
    columnIds: string[],
): Promise<DbResult<{ columnsOrder: string[] }>> {
    try {
        await settingsTable.update('global', {
            'layout.columnsOrder': columnIds,
        });
        return { success: true, data: { columnsOrder: columnIds } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getColumnsOrder(): Promise<DbResult<string[]>> {
    try {
        const settings = await settingsTable.get('global');
        return {
            success: true,
            data: settings?.layout.columnsOrder ?? [],
        };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
