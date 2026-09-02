import { api } from 'shared/api/client';
import type {
    ColumnEntry,
    ColumnEntryMeta,
    ColumnEntryValueType,
    DbResult,
} from '@onda/shared';

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
    return api.entries.getDayEntry(columnId, dayDate);
}

export async function getEntriesForWeek(
    weekStart: string,
): Promise<DbResult<ColumnEntry[]>> {
    return api.entries.getEntriesForWeek(weekStart);
}

export async function getEntriesForDateRange(
    startDate: string,
    endDate: string,
): Promise<DbResult<ColumnEntry[]>> {
    return api.entries.getEntriesForDateRange(startDate, endDate);
}

export async function upsertDayEntry({
    columnId,
    dayDate,
    valueType,
    value,
    meta,
}: UpsertDayEntryParams): Promise<DbResult<ColumnEntry>> {
    return api.entries.upsertDayEntry({
        columnId,
        dayDate,
        valueType,
        value,
        meta,
    });
}

export async function deleteEntriesForColumn(
    columnId: string,
): Promise<DbResult<{ deletedCount: number }>> {
    return api.entries.deleteEntriesForColumn(columnId);
}

export async function clearEntriesForColumn(
    columnId: string,
): Promise<DbResult<{ deletedCount: number }>> {
    return deleteEntriesForColumn(columnId);
}
