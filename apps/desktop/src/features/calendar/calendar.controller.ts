import type { IpcMainInvokeEvent } from 'electron';
import type { CalendarEntry } from '@onda/shared';
import {
    getAllCalendarEvents,
    getCalendarEventsByDate,
    getCalendarEventById,
    getCalendarEventsInRange,
} from './services/get-calendar-events';
import { createCalendarEvent } from './services/create-calendar-event';
import { updateCalendarEvent, saveCalendarEvent } from './services/update-calendar-event';
import { deleteCalendarEvent } from './services/delete-calendar-event';
import { notifyDbChanged } from '../../core/events';

export const calendarController = {
    async getAll() {
        return getAllCalendarEvents();
    },

    async getByDate(_e: IpcMainInvokeEvent, date: string) {
        return getCalendarEventsByDate(date);
    },

    async getById(_e: IpcMainInvokeEvent, id: string) {
        return getCalendarEventById(id);
    },

    async getInRange(_e: IpcMainInvokeEvent, startDate: string, endDate: string) {
        return getCalendarEventsInRange(startDate, endDate);
    },

    async create(_e: IpcMainInvokeEvent, event: Omit<CalendarEntry, 'id'>) {
        const res = await createCalendarEvent(event);
        if (res.success) notifyDbChanged({ table: 'calendar', action: 'create' });
        return res;
    },

    async update(_e: IpcMainInvokeEvent, id: string, updates: Partial<Omit<CalendarEntry, 'id'>>) {
        const res = await updateCalendarEvent(id, updates);
        if (res.success) notifyDbChanged({ table: 'calendar', action: 'update' });
        return res;
    },

    async save(_e: IpcMainInvokeEvent, event: CalendarEntry | Omit<CalendarEntry, 'id'>) {
        const res = await saveCalendarEvent(event);
        if (res.success) notifyDbChanged({ table: 'calendar', action: 'update' });
        return res;
    },

    async delete(_e: IpcMainInvokeEvent, id: string) {
        const res = await deleteCalendarEvent(id);
        if (res.success) notifyDbChanged({ table: 'calendar', action: 'delete' });
        return res;
    },
};
