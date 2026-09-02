import { getPrismaClient } from '../../core/database';
import type { DbResult } from '@onda/shared';

export const systemService = {
    async clearAllData(): Promise<DbResult<boolean>> {
        try {
            const prisma = getPrismaClient();
            await prisma.$transaction([
                prisma.columnEntry.deleteMany(),
                prisma.calendarEvent.deleteMany(),
                prisma.column.deleteMany(),
                prisma.setting.deleteMany(),
            ]);

            // Re-create empty default settings
            await prisma.setting.create({
                data: {
                    id: 'global',
                    layout: JSON.stringify({ columnsOrder: [] }),
                },
            });

            return { success: true, data: true };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },
};
