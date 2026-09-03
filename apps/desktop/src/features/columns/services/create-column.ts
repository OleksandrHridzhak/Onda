import { prisma } from '../../../core/lib/database';
import type { Column, DbResult } from '@onda/shared';
import { serializeColumn } from './get-columns';

export async function createColumn(column: Column): Promise<DbResult<Column>> {
    try {
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
}
