import { prisma } from '../../../core/lib/database';
import type { Column, DbResult } from '@onda/shared';

function serializeColumn(col: any): Column {
    let uniqueProps = {};
    try {
        uniqueProps = typeof col.uniqueProps === 'string' ? JSON.parse(col.uniqueProps) : col.uniqueProps || {};
    } catch {
        uniqueProps = {};
    }

    return {
        id: col.id,
        name: col.name,
        isNameVisible: col.isNameVisible,
        description: col.description,
        emojiIconName: col.emojiIconName,
        width: col.width,
        type: col.type as Column['type'],
        uniqueProps,
        lifecycle: {
            createdAt: col.createdAt ? new Date(col.createdAt).toISOString() : null,
            archivedAt: col.archivedAt ? new Date(col.archivedAt).toISOString() : null,
        },
    } as Column;
}

export { serializeColumn };

export async function getAllColumns(): Promise<DbResult<Column[]>> {
    try {
        const cols = await prisma.column.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, data: cols.map(serializeColumn) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getColumnById(id: string): Promise<DbResult<Column>> {
    try {
        const col = await prisma.column.findUnique({ where: { id } });
        if (!col) return { success: false, error: `Column ${id} not found` };
        return { success: true, data: serializeColumn(col) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getColumnsByIds(ids: string[]): Promise<DbResult<(Column | undefined)[]>> {
    try {
        const cols = await prisma.column.findMany({
            where: { id: { in: ids } },
        });
        const colMap = new Map(cols.map((c) => [c.id, serializeColumn(c)]));
        return { success: true, data: ids.map((id) => colMap.get(id)) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
