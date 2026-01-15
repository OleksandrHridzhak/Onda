import { db } from '../index';
import { Column } from '../../types/newColumn.types';

/**
 * Update ONLY the columns order (typically used after Drag-and-Drop)
 */
export async function updateColumnsOrder(columnIds: string[]) {
    try {
        await db.settings.update('global', { columnsOrder: columnIds });
        console.log('Columns order updated successfully');
        return { status: 'success' };
    } catch (error) {
        console.error('Failed to update columns order:', error);
        return { status: 'error' };
    }
}

/**
 * Retrieve the current columns order from settings
 */
export async function getColumnsOrder(): Promise<string[]> {
    try {
        const settings = await db.settings.get('global');
        return settings?.columnsOrder || [];
    } catch (error) {
        console.error('Failed to get columns order:', error);
        return [];
    }
}
