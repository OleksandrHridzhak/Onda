import { db } from '../index';
import { Column } from '../../types/newColumn.types';
import { COLUMN_TEMPLATES } from '../column.templates';
import { ColumnType } from '../../constants/columnTypes';
import { DbResult } from '../types';

/**
 * Fetch all columns from the database
 */

export async function getAllColumns(): Promise<DbResult<Column[]>> {
    try {
        const data = await db.tableColumns.toArray();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch columns:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Get a specific column by its ID
 * @param columnId - The unique ID of the column to get
 */
export async function getColumnById(
    columnId: string,
): Promise<DbResult<Column>> {
    try {
        const data = await db.tableColumns.get(columnId);
        if (!data) {
            return {
                success: false,
                error: `Column with ID ${columnId} not found`,
            };
        }
        return { success: true, data };
    } catch (error) {
        console.error(`Failed to fetch column with ID ${columnId}:`, error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Creates a new column based on a predefined template and updates the global order.
 * @param type - The specific type of column to be created (e.g., 'todoListColumn').(watch constants/columnTypes.ts)
 */
export async function createColumn(
    type: ColumnType,
): Promise<DbResult<{ id: string; column: Column }>> {
    const id = crypto.randomUUID();

    // 1. Retrieve the blueprint for the requested column type
    const template = COLUMN_TEMPLATES[type];

    if (!template) {
        return {
            success: false,
            error: `Template for type "${type}" not found.`,
        };
    }

    try {
        // 2. Execute a transaction to ensure both operations succeed or fail together
        return await db.transaction(
            'rw',
            [db.tableColumns, db.settings],
            async () => {
                // 3. Create the final column object by merging the template with the new ID
                const newColumn: Column = {
                    ...template,
                    id,
                } as Column;

                // 4. Persist the new column record to IndexedDB
                await db.tableColumns.add(newColumn);

                // 5. Update the global order array in settings to include the new column
                const settings = await db.settings.get('global');
                if (settings) {
                    const newOrder = [...settings.columnsOrder, id];
                    await db.settings.update('global', {
                        columnsOrder: newOrder,
                    });
                }

                console.log(
                    `[Onda DB] Successfully created ${type} with ID:`,
                    id,
                );
                return { success: true, data: { id, column: newColumn } };
            },
        );
    } catch (error) {
        console.error(
            `[Onda DB] Failed to create column of type ${type}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Updates specific fields of a column using its ID.
 * Supports both top-level properties (e.g., { name: 'New Name' })
 * and nested properties via dot notation (e.g., { 'uniqueProps.checkboxColor': 'blue' }).
 * * @param columnId - The unique ID of the column to update.
 * @param changes - An object containing the fields and their new values.
 */
export async function updateColumnFields(
    columnId: string,
    changes: Record<string, any>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        // We use .update() instead of .put() to avoid overwriting the entire record.
        // It returns the number of updated records (1 if success, 0 if not found).
        const updatedCount = await db.tableColumns.update(columnId, changes);

        if (updatedCount === 0) {
            console.warn(`[Onda DB] No column found with ID: ${columnId}`);
            return {
                success: false,
                error: `No column found with ID: ${columnId}`,
            };
        }

        console.log(
            `[Onda DB] Column ${columnId} fields updated:`,
            Object.keys(changes),
        );
        return { success: true, data: { updatedCount } };
    } catch (error) {
        console.error(
            `[Onda DB] Failed to update column fields for ${columnId}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Completely delete a column and remove its ID from the global order
 * @param columnId - The unique ID of the column to delete
 */
export async function deleteColumn(
    columnId: string,
): Promise<DbResult<{ columnId: string }>> {
    try {
        await db.transaction('rw', [db.tableColumns, db.settings], async () => {
            // 1. Delete the column record
            await db.tableColumns.delete(columnId);

            // 2. Remove the ID from the global order array
            const settings = await db.settings.get('global');
            if (settings) {
                const newOrder = settings.columnsOrder.filter(
                    (id) => id !== columnId,
                );
                await db.settings.update('global', { columnsOrder: newOrder });
            }
        });

        console.log('Column and order reference deleted:', columnId);
        return { success: true, data: { columnId } };
    } catch (error) {
        console.error('Error during column deletion:', error);
        return { success: false, error: (error as Error).message };
    }
}
