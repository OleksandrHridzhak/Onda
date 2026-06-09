import { getTable, type DbResult } from 'shared/api/db';
import type { Column } from '../model/types';

const columnsTable = getTable<Column>('tableColumns');

export async function getAllColumns(): Promise<DbResult<Column[]>> {
    try {
        return { success: true, data: await columnsTable.toArray() };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getColumnById(
    columnId: string,
): Promise<DbResult<Column>> {
    try {
        const data = await columnsTable.get(columnId);

        return data
            ? { success: true, data }
            : {
                  success: false,
                  error: `Column with ID ${columnId} not found`,
              };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export function getColumnsByIds(
    columnIds: string[],
): Promise<(Column | undefined)[]> {
    return columnsTable.bulkGet(columnIds);
}
