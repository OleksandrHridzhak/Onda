import { api } from 'shared/api/client';
import type { CalendarEntry, DbResult } from '@onda/shared';

export async function getAllCalendarEvents(): Promise<
    DbResult<CalendarEntry[]>
> {
    return api.calendar.getAll();
}

export async function getCalendarEventsByDate(
    date: string,
): Promise<DbResult<CalendarEntry[]>> {
    return api.calendar.getByDate(date);
}

export async function getCalendarEventById(
    eventId: string,
): Promise<DbResult<CalendarEntry>> {
    return api.calendar.getById(eventId);
}

export async function createCalendarEvent(
    eventData: Omit<CalendarEntry, 'id'>,
): Promise<DbResult<CalendarEntry>> {
    return api.calendar.create(eventData);
}

export async function updateCalendarEvent(
    eventId: string,
    updates: Partial<Omit<CalendarEntry, 'id'>>,
): Promise<DbResult<{ updatedCount: number }>> {
    return api.calendar.update(eventId, updates);
}

export async function saveCalendarEvent(
    eventData: CalendarEntry | Omit<CalendarEntry, 'id'>,
): Promise<DbResult<CalendarEntry>> {
    return api.calendar.save(eventData);
}

export async function deleteCalendarEvent(
    eventId: string,
): Promise<DbResult<{ eventId: string }>> {
    return api.calendar.delete(eventId);
}

export async function getCalendarEventsInRange(
    startDate: string,
    endDate: string,
): Promise<DbResult<CalendarEntry[]>> {
    return api.calendar.getInRange(startDate, endDate);
}
