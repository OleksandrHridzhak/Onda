import type { IpcMainInvokeEvent } from 'electron';
import type { UpsertDayEntryInput } from '@onda/shared';
import { getDayEntry, getEntriesForWeek, getEntriesForDateRange } from './services/get-entries';
import { upsertDayEntry } from './services/upsert-entry';
import { deleteEntriesForColumn } from './services/delete-entries';
import { notifyDbChanged } from '../../core/lib/events';

export const entriesController = {
    async getDayEntry(_e: IpcMainInvokeEvent, columnId: string, dayDate: string) {
        return getDayEntry(columnId, dayDate);
    },

    async getEntriesForWeek(_e: IpcMainInvokeEvent, weekStart: string) {
        return getEntriesForWeek(weekStart);
    },

    async getEntriesForDateRange(_e: IpcMainInvokeEvent, startDate: string, endDate: string) {
        return getEntriesForDateRange(startDate, endDate);
    },

    async upsertDayEntry(_e: IpcMainInvokeEvent, input: UpsertDayEntryInput) {
        const res = await upsertDayEntry(input);
        if (res.success) notifyDbChanged({ table: 'entries', action: 'update' });
        return res;
    },

    async deleteEntriesForColumn(_e: IpcMainInvokeEvent, columnId: string) {
        const res = await deleteEntriesForColumn(columnId);
        if (res.success) notifyDbChanged({ table: 'entries', action: 'delete' });
        return res;
    },
};
