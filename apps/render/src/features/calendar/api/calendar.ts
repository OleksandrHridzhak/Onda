import { api } from 'shared/api/client';
import type { CalendarEntry, DbResult } from '@onda/shared';

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
