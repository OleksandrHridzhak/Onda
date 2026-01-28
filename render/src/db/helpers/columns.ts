import { db } from '../index';
import { Column, createEmptyWeeklyValues } from '../../types/newColumn.types';
import { COLUMN_TYPES } from '../../constants/columnTypes';
import { COLUMN_TEMPLATES } from '../column.templates';
import { ColumnType } from '../../constants/columnTypes';
import { DbResult } from '../types';

/**
 * Fetch all columns from the database
 * @returns DbResult with array of columns
 * @example
 * // Success:
 * { success: true, data: [{ id: '123', name: 'Tasks', type: 'todoListColumn', ... }] }
 *
 * // Error:
 * { success: false, error: 'Failed to connect to database' }
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
 * @returns DbResult with the column object
 * @example
 * // Success:
 * { success: true, data: { id: '123', name: 'Tasks', type: 'todoListColumn', ... } }
 *
 * // Not found:
 * { success: false, error: 'Column with ID abc not found' }
 *
 * // Error:
 * { success: false, error: 'Database connection failed' }
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
 * @returns DbResult with the new column object (includes id)
 * @example
 * // Success:
 * {
 *   success: true,
 *   data: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'New Column', type: 'todoListColumn', ... }
 * }
 *
 * // Template not found:
 * { success: false, error: 'Template for type "invalidType" not found.' }
 *
 * // Error:
 * { success: false, error: 'Transaction failed' }
 */
export async function createColumn(
    type: ColumnType,
): Promise<DbResult<Column>> {
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
                    const newOrder = [...settings.layout.columnsOrder, id];
                    await db.settings.update('global', {
                        layout: { columnsOrder: newOrder },
                    });
                } else {
                    throw new Error('Global settings not found');
                }

                console.log(
                    `[Onda DB] Successfully created ${type} with ID:`,
                    id,
                );
                return { success: true, data: newColumn };
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
 * @param columnId - The unique ID of the column to update.
 * @param changes - An object containing the fields and their new values.
 * @returns DbResult with the count of updated records
 * @example
 * // Success:
 * { success: true, data: { updatedCount: 1 } }
 *
 * // Column not found:
 * { success: false, error: 'No column found with ID: abc123' }
 *
 * // Error:
 * { success: false, error: 'Update failed: constraint violation' }
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
 * @returns DbResult with the deleted column's id
 * @example
 * // Success:
 * { success: true, data: { columnId: '550e8400-e29b-41d4-a716-446655440000' } }
 *
 * // Error:
 * { success: false, error: 'Column not found or deletion failed' }
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
                const newOrder = settings.layout.columnsOrder.filter(
                    (id) => id !== columnId,
                );
                await db.settings.update('global', {
                    layout: { columnsOrder: newOrder },
                });
            }
        });

        console.log('Column and order reference deleted:', columnId);
        return { success: true, data: { columnId } };
    } catch (error) {
        console.error('Error during column deletion:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Move a column left or right in the columns order
 * @param columnId - The unique ID of the column to move
 * @param direction - 'left' or 'right'
 * @returns DbResult with the new columns order
 * @example
 * // Success:
 * { success: true, data: { columnsOrder: ['id1', 'id2', 'id3'] } }
 *
 * // Error:
 * { success: false, error: 'Cannot move column further left' }
 */
export async function moveColumn(
    columnId: string,
    direction: 'left' | 'right',
): Promise<DbResult<{ columnsOrder: string[] }>> {
    try {
        const settings = await db.settings.get('global');
        if (!settings) {
            return { success: false, error: 'Settings not found' };
        }

        const currentOrder = settings.layout.columnsOrder;
        const currentIndex = currentOrder.indexOf(columnId);

        if (currentIndex === -1) {
            return { success: false, error: 'Column not found in order' };
        }

        const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0) {
            return { success: false, error: 'Cannot move column further left' };
        }

        if (newIndex >= currentOrder.length) {
            return { success: false, error: 'Cannot move column further right' };
        }

        // Swap positions
        const newOrder = [...currentOrder];
        [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

        await db.settings.update('global', {
            layout: { columnsOrder: newOrder },
        });

        console.log(`[Onda DB] Column ${columnId} moved ${direction}`);
        return { success: true, data: { columnsOrder: newOrder } };
    } catch (error) {
        console.error('Error moving column:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Clear all data in a column (reset to default values based on type)
 * @param columnId - The unique ID of the column to clear
 * @returns DbResult with the updated column
 * @example
 * // Success:
 * { success: true, data: { id: '123', name: 'Tasks', type: 'todoListColumn', ... } }
 *
 * // Error:
 * { success: false, error: 'Column not found' }
 */
export async function clearColumn(
    columnId: string,
): Promise<DbResult<Column>> {
    try {
        const column = await db.tableColumns.get(columnId);
        if (!column) {
            return { success: false, error: 'Column not found' };
        }

        // Clear data based on column type
        let updates: Record<string, any> = {};

        switch (column.type) {
            case COLUMN_TYPES.CHECKBOX:
                updates = {
                    'uniqueProps.days': createEmptyWeeklyValues(false),
                };
                break;
            case COLUMN_TYPES.TEXTBOX:
                updates = {
                    'uniqueProps.days': createEmptyWeeklyValues(''),
                };
                break;
            case COLUMN_TYPES.NUMBERBOX:
                updates = {
                    'uniqueProps.days': createEmptyWeeklyValues(0),
                };
                break;
            case COLUMN_TYPES.TAGS:
            case COLUMN_TYPES.MULTI_CHECKBOX:
                updates = {
                    'uniqueProps.days': createEmptyWeeklyValues<string[]>([]),
                };
                break;
            case COLUMN_TYPES.TODO:
                updates = {
                    'uniqueProps.todos': [],
                };
                break;
            case COLUMN_TYPES.TASK_TABLE:
                updates = {
                    'uniqueProps.doneTasks': [],
                };
                break;
        }

        await db.tableColumns.update(columnId, updates);
        const updatedColumn = await db.tableColumns.get(columnId);

        console.log(`[Onda DB] Column ${columnId} data cleared`);
        return { success: true, data: updatedColumn! };
    } catch (error) {
        console.error('Error clearing column:', error);
        return { success: false, error: (error as Error).message };
    }
}
