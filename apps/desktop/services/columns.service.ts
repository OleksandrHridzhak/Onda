import { getPrismaClient } from './database';
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

export const columnsService = {
    async getAll(): Promise<DbResult<Column[]>> {
        try {
            const prisma = getPrismaClient();
            const cols = await prisma.column.findMany({
                orderBy: { order: 'asc' },
            });
            return { success: true, data: cols.map(serializeColumn) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getById(id: string): Promise<DbResult<Column>> {
        try {
            const prisma = getPrismaClient();
            const col = await prisma.column.findUnique({ where: { id } });
            if (!col) return { success: false, error: `Column ${id} not found` };
            return { success: true, data: serializeColumn(col) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getByIds(ids: string[]): Promise<DbResult<(Column | undefined)[]>> {
        try {
            const prisma = getPrismaClient();
            const cols = await prisma.column.findMany({
                where: { id: { in: ids } },
            });
            const colMap = new Map(cols.map((c) => [c.id, serializeColumn(c)]));
            return { success: true, data: ids.map((id) => colMap.get(id)) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async create(column: Column): Promise<DbResult<Column>> {
        try {
            const prisma = getPrismaClient();
            const created = await prisma.column.create({
                data: {
                    id: column.id,
                    name: column.name,
                    isNameVisible: column.isNameVisible,
                    description: column.description || '',
                    emojiIconName: column.emojiIconName || 'Star',
                    width: column.width || 200,
                    type: column.type,
                    uniqueProps: JSON.stringify(column.uniqueProps || {}),
                    createdAt: column.lifecycle?.createdAt ? new Date(column.lifecycle.createdAt) : new Date(),
                    archivedAt: column.lifecycle?.archivedAt ? new Date(column.lifecycle.archivedAt) : null,
                },
            });

            // Update columns order in settings
            const settings = await prisma.setting.findUnique({ where: { id: 'global' } });
            if (settings) {
                let layout = { columnsOrder: [] as string[] };
                try {
                    layout = JSON.parse(settings.layout);
                } catch {
                    layout = { columnsOrder: [] };
                }
                if (!layout.columnsOrder.includes(column.id)) {
                    layout.columnsOrder.push(column.id);
                    await prisma.setting.update({
                        where: { id: 'global' },
                        data: { layout: JSON.stringify(layout) },
                    });
                }
            }

            return { success: true, data: serializeColumn(created) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async updateFields(id: string, fields: Partial<Column>): Promise<DbResult<{ updatedCount: number }>> {
        try {
            const prisma = getPrismaClient();
            const dataToUpdate: any = {};
            if (fields.name !== undefined) dataToUpdate.name = fields.name;
            if (fields.isNameVisible !== undefined) dataToUpdate.isNameVisible = fields.isNameVisible;
            if (fields.description !== undefined) dataToUpdate.description = fields.description;
            if (fields.emojiIconName !== undefined) dataToUpdate.emojiIconName = fields.emojiIconName;
            if (fields.width !== undefined) dataToUpdate.width = fields.width;
            if (fields.uniqueProps !== undefined) dataToUpdate.uniqueProps = JSON.stringify(fields.uniqueProps);
            if (fields.lifecycle?.archivedAt !== undefined) {
                dataToUpdate.archivedAt = fields.lifecycle.archivedAt ? new Date(fields.lifecycle.archivedAt) : null;
            }

            await prisma.column.update({
                where: { id },
                data: dataToUpdate,
            });

            return { success: true, data: { updatedCount: 1 } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async updateUniqueProps(id: string, uniqueProps: unknown): Promise<DbResult<{ columnId: string }>> {
        try {
            const prisma = getPrismaClient();
            await prisma.column.update({
                where: { id },
                data: { uniqueProps: JSON.stringify(uniqueProps || {}) },
            });
            return { success: true, data: { columnId: id } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async archive(id: string, archivedAt: string): Promise<DbResult<{ columnId: string }>> {
        try {
            const prisma = getPrismaClient();
            await prisma.column.update({
                where: { id },
                data: { archivedAt: new Date(archivedAt) },
            });
            return { success: true, data: { columnId: id } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async delete(id: string): Promise<DbResult<{ columnId: string }>> {
        try {
            const prisma = getPrismaClient();
            await prisma.columnEntry.deleteMany({ where: { columnId: id } });
            await prisma.column.delete({ where: { id } });

            const settings = await prisma.setting.findUnique({ where: { id: 'global' } });
            if (settings) {
                let layout = { columnsOrder: [] as string[] };
                try {
                    layout = JSON.parse(settings.layout);
                } catch {
                    layout = { columnsOrder: [] };
                }
                layout.columnsOrder = layout.columnsOrder.filter((cid) => cid !== id);
                await prisma.setting.update({
                    where: { id: 'global' },
                    data: { layout: JSON.stringify(layout) },
                });
            }

            return { success: true, data: { columnId: id } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async reorder(order: string[]): Promise<DbResult<{ columnsOrder: string[] }>> {
        try {
            const prisma = getPrismaClient();
            const settings = await prisma.setting.findUnique({ where: { id: 'global' } });
            let layout = { columnsOrder: order };
            if (settings) {
                try {
                    layout = { ...JSON.parse(settings.layout), columnsOrder: order };
                } catch {
                    layout = { columnsOrder: order };
                }
                await prisma.setting.update({
                    where: { id: 'global' },
                    data: { layout: JSON.stringify(layout) },
                });
            } else {
                await prisma.setting.create({
                    data: { id: 'global', layout: JSON.stringify(layout) },
                });
            }
            return { success: true, data: { columnsOrder: order } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async move(columnId: string, direction: 'left' | 'right'): Promise<DbResult<{ columnsOrder: string[] }>> {
        try {
            const prisma = getPrismaClient();
            const settings = await prisma.setting.findUnique({ where: { id: 'global' } });
            if (!settings) return { success: false, error: 'Settings not found' };

            let layout = { columnsOrder: [] as string[] };
            try {
                layout = JSON.parse(settings.layout);
            } catch {
                layout = { columnsOrder: [] };
            }

            const currentOrder = layout.columnsOrder;
            const cols = await prisma.column.findMany({
                where: { id: { in: currentOrder } },
            });
            const colMap = new Map(cols.map((c) => [c.id, c]));
            const activeOrder = currentOrder.filter((id) => {
                const c = colMap.get(id);
                return c && !c.archivedAt;
            });

            const currentIndex = activeOrder.indexOf(columnId);
            const nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

            if (currentIndex === -1 || nextIndex < 0 || nextIndex >= activeOrder.length) {
                return { success: false, error: 'Cannot move column further in that direction' };
            }

            const newOrder = [...currentOrder];
            const otherColumnId = activeOrder[nextIndex];
            const currentOrderIndex = newOrder.indexOf(columnId);
            const otherOrderIndex = newOrder.indexOf(otherColumnId);

            [newOrder[currentOrderIndex], newOrder[otherOrderIndex]] = [
                newOrder[otherOrderIndex],
                newOrder[currentOrderIndex],
            ];

            await prisma.setting.update({
                where: { id: 'global' },
                data: { layout: JSON.stringify({ ...layout, columnsOrder: newOrder }) },
            });

            return { success: true, data: { columnsOrder: newOrder } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },
};
