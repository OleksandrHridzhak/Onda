import {
    getColumnsByIds,
    isColumnArchived,
    type Column,
} from 'entities/Column';
import type { ColumnEntry } from 'entities/ColumnEntry';
import type { Setting } from 'entities/Settings';
import { getTable, runTransaction, type DbResult } from 'shared/api/db';

const columnsTable = getTable<Column>('tableColumns');
const entriesTable = getTable<ColumnEntry>('columnEntries');
const settingsTable = getTable<Setting>('settings');

export async function archiveColumn(
    columnId: string,
    archivedAt: Date,
): Promise<DbResult<{ columnId: string }>> {
    try {
        const updatedCount = await columnsTable.update(columnId, {
            'lifecycle.archivedAt': archivedAt.toISOString(),
        });

        return updatedCount
            ? { success: true, data: { columnId } }
            : {
                  success: false,
                  error: `No column found with ID: ${columnId}`,
              };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function permanentlyDeleteColumn(
    columnId: string,
): Promise<DbResult<{ columnId: string }>> {
    try {
        return await runTransaction(
            ['tableColumns', 'columnEntries', 'settings'],
            async () => {
                const column = await columnsTable.get(columnId);
                if (!column) {
                    return {
                        success: false,
                        error: `No column found with ID: ${columnId}`,
                    };
                }

                await entriesTable.where('columnId').equals(columnId).delete();
                await columnsTable.delete(columnId);

                const settings = await settingsTable.get('global');
                if (settings) {
                    await settingsTable.update('global', {
                        layout: {
                            columnsOrder: settings.layout.columnsOrder.filter(
                                (id) => id !== columnId,
                            ),
                        },
                    });
                }

                return { success: true, data: { columnId } };
            },
        );
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function moveColumn(
    columnId: string,
    direction: 'left' | 'right',
): Promise<DbResult<{ columnsOrder: string[] }>> {
    try {
        const settings = await settingsTable.get('global');
        if (!settings) {
            return { success: false, error: 'Settings not found' };
        }

        const currentOrder = settings.layout.columnsOrder;
        const columns = await getColumnsByIds(currentOrder);
        const activeOrder = currentOrder.filter(
            (_, index) => columns[index] && !isColumnArchived(columns[index]!),
        );
        const currentIndex = activeOrder.indexOf(columnId);
        const nextIndex =
            direction === 'left' ? currentIndex - 1 : currentIndex + 1;

        if (currentIndex === -1 || nextIndex < 0) {
            return {
                success: false,
                error: 'Cannot move column further left',
            };
        }

        if (nextIndex >= activeOrder.length) {
            return {
                success: false,
                error: 'Cannot move column further right',
            };
        }

        const newOrder = [...currentOrder];
        const otherColumnId = activeOrder[nextIndex];
        const currentOrderIndex = newOrder.indexOf(columnId);
        const otherOrderIndex = newOrder.indexOf(otherColumnId);

        [newOrder[currentOrderIndex], newOrder[otherOrderIndex]] = [
            newOrder[otherOrderIndex],
            newOrder[currentOrderIndex],
        ];

        await settingsTable.update('global', {
            layout: { columnsOrder: newOrder },
        });

        return { success: true, data: { columnsOrder: newOrder } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
