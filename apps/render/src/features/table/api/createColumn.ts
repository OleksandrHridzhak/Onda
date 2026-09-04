import { COLUMN_DEFINITIONS } from '../types/columnDefinitions';
import type { ColumnType, Column, DbResult } from '@onda/shared';
import { api } from 'shared/api/client';

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
