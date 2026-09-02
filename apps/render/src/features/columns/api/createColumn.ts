import { COLUMN_DEFINITIONS } from 'features/columns/types/definitions';
import type { ColumnType, Column } from '@onda/shared';
import { api } from 'shared/api/client';
import type { DbResult } from '@onda/shared';

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
    const id = crypto.randomUUID();
    const newColumn = {
        ...template,
        id,
        lifecycle: {
            createdAt: createdAt.toISOString(),
            archivedAt: null,
        },
    } as Column;

    return api.columns.create(newColumn);
}
