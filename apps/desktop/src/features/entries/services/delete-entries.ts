import { prisma } from '../../../core/lib/database';
import type { DbResult } from '@onda/shared';

export async function deleteEntriesForColumn(columnId: string): Promise<DbResult<{ deletedCount: number }>> {
    try {
        const res = await prisma.columnEntry.deleteMany({
            where: { columnId },
        });
        return { success: true, data: { deletedCount: res.count } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
