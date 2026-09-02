import { getPrismaClient } from '../../core/database';
import type { Setting, DbResult } from '@onda/shared';

export const settingsService = {
    async get(): Promise<DbResult<Setting>> {
        try {
            const prisma = getPrismaClient();
            let setting = await prisma.setting.findUnique({ where: { id: 'global' } });
            if (!setting) {
                setting = await prisma.setting.create({
                    data: {
                        id: 'global',
                        layout: JSON.stringify({ columnsOrder: [] }),
                    },
                });
            }
            let layout = { columnsOrder: [] as string[] };
            try {
                layout = JSON.parse(setting.layout);
            } catch {
                layout = { columnsOrder: [] };
            }
            return {
                success: true,
                data: {
                    id: 'global',
                    layout,
                },
            };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async update(updates: Partial<Omit<Setting, 'id'>>): Promise<DbResult<{ updatedCount: number }>> {
        try {
            const prisma = getPrismaClient();
            const current = await this.get();
            const newLayout = updates.layout || current.data?.layout || { columnsOrder: [] };

            await prisma.setting.upsert({
                where: { id: 'global' },
                create: {
                    id: 'global',
                    layout: JSON.stringify(newLayout),
                },
                update: {
                    layout: JSON.stringify(newLayout),
                },
            });

            return { success: true, data: { updatedCount: 1 } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getColumnsOrder(): Promise<DbResult<string[]>> {
        const res = await this.get();
        if (res.success && res.data) {
            return { success: true, data: res.data.layout.columnsOrder || [] };
        }
        return { success: false, error: res.error || 'Failed to get columns order' };
    },

    async updateColumnsOrder(columnIds: string[]): Promise<DbResult<{ columnsOrder: string[] }>> {
        const res = await this.update({ layout: { columnsOrder: columnIds } });
        if (res.success) {
            return { success: true, data: { columnsOrder: columnIds } };
        }
        return { success: false, error: res.error || 'Failed to update columns order' };
    },
};
