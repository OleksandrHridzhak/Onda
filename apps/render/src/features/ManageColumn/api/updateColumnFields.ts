import type { Column } from 'entities/Column';
import { getTable, type DbResult } from 'shared/api/db';

const columnsTable = getTable<Column>('tableColumns');

export async function updateColumnFields(
    columnId: string,
    changes: Record<string, unknown>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        const updatedCount = await columnsTable.update(
            columnId,
            changes as Parameters<typeof columnsTable.update>[1],
        );

        return updatedCount
            ? { success: true, data: { updatedCount } }
            : {
                  success: false,
                  error: `No column found with ID: ${columnId}`,
              };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
