import { api } from 'shared/api/client';
import type { DbResult } from '@onda/shared';

export async function clearAllData(): Promise<
    DbResult<{
        deletedColumns: number;
        deletedEvents: number;
        resetSettings: boolean;
    }>
> {
    try {
        const res = await api.system.clearAllData();
        if (res.success) {
            return {
                success: true,
                data: {
                    deletedColumns: 0,
                    deletedEvents: 0,
                    resetSettings: true,
                },
            };
        }
        return { success: false, error: res.error || 'Failed to clear data' };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
