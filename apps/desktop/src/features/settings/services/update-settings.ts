import { prisma } from '../../../core/lib/database';
import type { Setting, DbResult } from '@onda/shared';
import { getSettings } from './get-settings';

export async function updateSettings(
    updates: Partial<Omit<Setting, 'id'>>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        const current = await getSettings();
        const newLayout = updates.layout || current.data?.layout || { columnsOrder: [] };

        await prisma.setting.upsert({
            where: { id: 'global' },
            create: {
                id: 'global',
                layout: JSON.stringify(newLayout),
            },
            update: {
                layout: JSON.stringify(newLayout),
            },
        });

        return { success: true, data: { updatedCount: 1 } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function updateColumnsOrder(columnIds: string[]): Promise<DbResult<{ columnsOrder: string[] }>> {
    const res = await updateSettings({ layout: { columnsOrder: columnIds } });
    if (res.success) {
        return { success: true, data: { columnsOrder: columnIds } };
    }
    return { success: false, error: res.error || 'Failed to update columns order' };
}
