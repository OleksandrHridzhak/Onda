import { prisma } from '../../../core/database';
import type { ColumnEntry, DbResult, UpsertDayEntryInput } from '@onda/shared';
import { serializeEntry } from './get-entries';

export async function upsertDayEntry(input: UpsertDayEntryInput): Promise<DbResult<ColumnEntry>> {
    try {
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
}
