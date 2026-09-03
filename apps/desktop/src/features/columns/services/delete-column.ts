import { prisma } from '../../../core/lib/database';
import type { DbResult } from '@onda/shared';

export async function deleteColumn(id: string): Promise<DbResult<{ columnId: string }>> {
    try {
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
}
