import { getTable } from 'shared/api/db';
import type {
    ColumnEntry,
    ColumnEntryMeta,
    ColumnEntryValueType,
} from '../model/types';
import { getWeekStartKey, parseDateKey } from 'shared/lib/date';
import type { DbResult } from 'shared/api/db';

const columnEntriesTable = getTable<ColumnEntry>('columnEntries');

interface UpsertDayEntryParams {
    columnId: string;
    dayDate: string;
    valueType: ColumnEntryValueType;
    value: unknown;
    meta?: ColumnEntryMeta;
}

export async function getDayEntry(
    columnId: string,
    dayDate: string,
): Promise<DbResult<ColumnEntry | null>> {
    try {
        const data =
            (await columnEntriesTable
                .where('[columnId+dateKey]')
                .equals([columnId, dayDate])
                .first()) || null;

        return { success: true, data };
    } catch (error) {
        console.error(
            `[Onda DB] Failed to fetch column entry for ${columnId} on ${dayDate}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}

export async function getEntriesForWeek(
    weekStart: string,
): Promise<DbResult<ColumnEntry[]>> {
    try {
        const data = await columnEntriesTable
            .where('weekStart')
            .equals(weekStart)
            .toArray();

        return { success: true, data };
    } catch (error) {
        console.error(
            `[Onda DB] Failed to fetch column entries for week ${weekStart}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}

export async function getEntriesForDateRange(
    startDate: string,
    endDate: string,
): Promise<DbResult<ColumnEntry[]>> {
    try {
        const data = await columnEntriesTable
            .where('dateKey')
            .between(startDate, endDate, true, true)
            .toArray();

        return { success: true, data };
    } catch (error) {
        console.error(
            `[Onda DB] Failed to fetch column entries from ${startDate} to ${endDate}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}

export async function upsertDayEntry({
    columnId,
    dayDate,
    valueType,
    value,
    meta,
}: UpsertDayEntryParams): Promise<DbResult<ColumnEntry>> {
    try {
        const normalizedDate = dayDate;
        const weekStart = getWeekStartKey(parseDateKey(normalizedDate));
        const existing = await columnEntriesTable
            .where('[columnId+dateKey]')
            .equals([columnId, normalizedDate])
            .first();
        const timestamp = new Date().toISOString();

        const entry: ColumnEntry = existing
            ? {
                  ...existing,
                  valueType,
                  value,
                  meta,
                  updatedAt: timestamp,
              }
            : {
                  id: crypto.randomUUID(),
                  columnId,
                  scope: 'day',
                  dateKey: normalizedDate,
                  dayDate: normalizedDate,
                  weekStart,
                  valueType,
                  value,
                  meta,
                  createdAt: timestamp,
                  updatedAt: timestamp,
              };

        await columnEntriesTable.put(entry);

        return { success: true, data: entry };
    } catch (error) {
        console.error(
            `[Onda DB] Failed to upsert column entry for ${columnId} on ${dayDate}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteEntriesForColumn(
    columnId: string,
): Promise<DbResult<{ deletedCount: number }>> {
    try {
        const keys = await columnEntriesTable
            .where('columnId')
            .equals(columnId)
            .primaryKeys();

        await columnEntriesTable.bulkDelete(keys);

        return { success: true, data: { deletedCount: keys.length } };
    } catch (error) {
        console.error(
            `[Onda DB] Failed to delete column entries for ${columnId}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}

export async function clearEntriesForColumn(
    columnId: string,
): Promise<DbResult<{ deletedCount: number }>> {
    return deleteEntriesForColumn(columnId);
}
