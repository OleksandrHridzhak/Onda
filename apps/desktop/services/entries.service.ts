import { getPrismaClient } from './database';
import type { ColumnEntry, DbResult, UpsertDayEntryInput } from '@onda/shared';

function serializeEntry(entry: any): ColumnEntry {
    let val: any = null;
    try {
        val = typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
    } catch {
        val = entry.value;
    }

    let meta: any = undefined;
    if (entry.meta) {
        try {
            meta = typeof entry.meta === 'string' ? JSON.parse(entry.meta) : entry.meta;
        } catch {
            meta = undefined;
        }
    }

    return {
        id: entry.id,
        columnId: entry.columnId,
        scope: entry.scope as 'day',
        dateKey: entry.dateKey,
        dayDate: entry.dayDate,
        weekStart: entry.weekStart,
        valueType: entry.valueType as any,
        value: val,
        meta,
        createdAt: new Date(entry.createdAt).toISOString(),
        updatedAt: new Date(entry.updatedAt).toISOString(),
    };
}

export const entriesService = {
    async getDayEntry(columnId: string, dayDate: string): Promise<DbResult<ColumnEntry | null>> {
        try {
            const prisma = getPrismaClient();
            const entry = await prisma.columnEntry.findUnique({
                where: {
                    columnId_dateKey: {
                        columnId,
                        dateKey: dayDate,
                    },
                },
            });
            return { success: true, data: entry ? serializeEntry(entry) : null };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getEntriesForWeek(weekStart: string): Promise<DbResult<ColumnEntry[]>> {
        try {
            const prisma = getPrismaClient();
            const entries = await prisma.columnEntry.findMany({
                where: { weekStart },
            });
            return { success: true, data: entries.map(serializeEntry) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getEntriesForDateRange(startDate: string, endDate: string): Promise<DbResult<ColumnEntry[]>> {
        try {
            const prisma = getPrismaClient();
            const entries = await prisma.columnEntry.findMany({
                where: {
                    dateKey: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            return { success: true, data: entries.map(serializeEntry) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async upsertDayEntry(input: UpsertDayEntryInput): Promise<DbResult<ColumnEntry>> {
        try {
            const prisma = getPrismaClient();
            const { columnId, dayDate, valueType, value, meta } = input;

            // Calculate weekStart from dayDate
            const dateObj = new Date(dayDate);
            const dayOfWeek = (dateObj.getDay() + 6) % 7; // Monday = 0
            const monday = new Date(dateObj);
            monday.setDate(dateObj.getDate() - dayOfWeek);
            const weekStart = monday.toISOString().split('T')[0];

            const serializedValue = JSON.stringify(value !== undefined ? value : null);
            const serializedMeta = meta ? JSON.stringify(meta) : null;
            const entryId = `${columnId}_${dayDate}`;

            const entry = await prisma.columnEntry.upsert({
                where: {
                    columnId_dateKey: {
                        columnId,
                        dateKey: dayDate,
                    },
                },
                create: {
                    id: entryId,
                    columnId,
                    scope: 'day',
                    dateKey: dayDate,
                    dayDate,
                    weekStart,
                    valueType,
                    value: serializedValue,
                    meta: serializedMeta,
                },
                update: {
                    valueType,
                    value: serializedValue,
                    meta: serializedMeta,
                },
            });

            return { success: true, data: serializeEntry(entry) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async deleteEntriesForColumn(columnId: string): Promise<DbResult<{ deletedCount: number }>> {
        try {
            const prisma = getPrismaClient();
            const res = await prisma.columnEntry.deleteMany({
                where: { columnId },
            });
            return { success: true, data: { deletedCount: res.count } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },
};
