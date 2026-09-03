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
