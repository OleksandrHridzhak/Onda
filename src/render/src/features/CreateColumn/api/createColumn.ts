import { COLUMN_DEFINITIONS, type Column } from 'entities/Column';
import type { ColumnType } from 'entities/Column';
import type { Setting } from 'entities/Settings';
import { getTable, runTransaction, type DbResult } from 'shared/api/db';

const columnsTable = getTable<Column>('tableColumns');
const settingsTable = getTable<Setting>('settings');

export async function createColumn(
    type: ColumnType,
    createdAt: Date = new Date(),
): Promise<DbResult<Column>> {
    const definition = Object.values(COLUMN_DEFINITIONS).find(
        ({ template }) => template.type === type,
    );

    if (!definition) {
        return {
            success: false,
            error: `Definition for type "${type}" not found.`,
        };
    }

    const template = definition.template;

    try {
        return await runTransaction(['tableColumns', 'settings'], async () => {
            const id = crypto.randomUUID();
            const newColumn = {
                ...template,
                id,
                lifecycle: {
                    createdAt: createdAt.toISOString(),
                    archivedAt: null,
                },
            } as Column;

            await columnsTable.add(newColumn);

            const settings = await settingsTable.get('global');
            if (!settings) {
                throw new Error('Global settings not found');
            }

            await settingsTable.update('global', {
                layout: {
                    columnsOrder: [...settings.layout.columnsOrder, id],
                },
            });

            return { success: true, data: newColumn };
        });
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
