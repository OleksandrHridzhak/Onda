import { prisma } from '../../../core/database';
import type { DbResult } from '@onda/shared';

export async function reorderColumns(order: string[]): Promise<DbResult<{ columnsOrder: string[] }>> {
    try {
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
}

export async function moveColumn(
    columnId: string,
    direction: 'left' | 'right',
): Promise<DbResult<{ columnsOrder: string[] }>> {
    try {
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
}
