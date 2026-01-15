import { db } from '../index';
import { CalendarEntry } from '../../types/calendar.types';
import { DbResult } from '../types';

/**
 * Get all calendar events
 * @returns DbResult with array of calendar entries
 * @example
 * // Success:
 * { success: true, data: [{ id: '1', title: 'Meeting', date: '2026-01-15', ... }] }
 *
 * // Error:
 * { success: false, error: 'Failed to fetch calendar events' }
 */
export async function getAllCalendarEvents(): Promise<
    DbResult<CalendarEntry[]>
> {
    try {
        const data = await db.calendar.toArray();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch calendar events:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Get calendar events for a specific date
 * @param date - Date string in format 'YYYY-MM-DD'
 * @returns DbResult with array of calendar entries for that date
 * @example
 * // Success:
 * { success: true, data: [{ id: 1, title: 'Meeting', date: '2026-01-15', ... }] }
 *
 * // Error:
 * { success: false, error: 'Failed to fetch events for date' }
 */
export async function getCalendarEventsByDate(
    date: string,
): Promise<DbResult<CalendarEntry[]>> {
    try {
        const data = await db.calendar.where('date').equals(date).toArray();
        return { success: true, data };
    } catch (error) {
        console.error(`Failed to fetch events for date ${date}:`, error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Get a specific calendar event by ID
 * @why We use it in modal to fetch event details
 * @param eventId - The unique ID of the event
 * @returns DbResult with the calendar entry
 * @example
 * // Success:
 * { success: true, data: { id: '1', title: 'Meeting', date: '2026-01-15', ... } }
 *
 * // Not found:
 * { success: false, error: 'Event with ID 123 not found' }
 *
 * // Error:
 * { success: false, error: 'Database error' }
 */
export async function getCalendarEventById(
    eventId: string,
): Promise<DbResult<CalendarEntry>> {
    try {
        const data = await db.calendar.get(eventId);
        if (!data) {
            return {
                success: false,
                error: `Event with ID ${eventId} not found`,
            };
        }
        return { success: true, data };
    } catch (error) {
        console.error(`Failed to fetch event with ID ${eventId}:`, error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Create a new calendar event
 * @param eventData - Calendar event data (without id, it will be auto-generated)
 * @returns DbResult with the created event
 * @example
 * // Success:
 * { success: true, data: { id: '123', title: 'Meeting', date: '2026-01-15', ... } }
 *
 * // Error:
 * { success: false, error: 'Failed to create event' }
 */
export async function createCalendarEvent(
    eventData: Omit<CalendarEntry, 'id'>,
): Promise<DbResult<CalendarEntry>> {
    try {
        const id = await db.calendar.add(eventData as CalendarEntry);
        const newEvent = { ...eventData, id } as CalendarEntry;

        console.log('[Onda DB] Successfully created calendar event:', id);
        return { success: true, data: newEvent };
    } catch (error) {
        console.error('[Onda DB] Failed to create calendar event:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Update an existing calendar event
 * @param eventId - The ID of the event to update
 * @param updates - Partial event data to update
 * @returns DbResult with updated count
 * @example
 * // Success:
 * { success: true, data: { updatedCount: 1 } }
 *
 * // Not found:
 * { success: false, error: 'Event with ID 123 not found' }
 *
 * // Error:
 * { success: false, error: 'Failed to update event' }
 */
export async function updateCalendarEvent(
    eventId: string,
    updates: Partial<Omit<CalendarEntry, 'id'>>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        const updatedCount = await db.calendar.update(eventId, updates);

        if (updatedCount === 0) {
            return {
                success: false,
                error: `Event with ID ${eventId} not found`,
            };
        }

        console.log('[Onda DB] Calendar event updated:', eventId);
        return { success: true, data: { updatedCount } };
    } catch (error) {
        console.error(`Failed to update event ${eventId}:`, error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Create or update a calendar event (upsert operation)
 * If the event has an id and exists, it will be updated; otherwise, a new event is created
 * @param eventData - Full calendar event data
 * @returns DbResult with the event
 * @example
 * // Success (created):
 * { success: true, data: { id: '123', title: 'Meeting', ... } }
 *
 * // Success (updated):
 * { success: true, data: { id: '123', title: 'Updated Meeting', ... } }
 *
 * // Error:
 * { success: false, error: 'Failed to save event' }
 */
export async function saveCalendarEvent(
    eventData: CalendarEntry | Omit<CalendarEntry, 'id'>,
): Promise<DbResult<CalendarEntry>> {
    try {
        const id = await db.calendar.put(eventData as CalendarEntry);
        const savedEvent = { ...eventData, id } as CalendarEntry;

        console.log('[Onda DB] Calendar event saved:', id);
        return { success: true, data: savedEvent };
    } catch (error) {
        console.error('[Onda DB] Failed to save calendar event:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Delete a calendar event
 * @param eventId - The ID of the event to delete
 * @returns DbResult with deleted event id
 * @example
 * // Success:
 * { success: true, data: { eventId: 123 } }
 *
 * // Error:
 * { success: false, error: 'Failed to delete event' }
 */
export async function deleteCalendarEvent(
    eventId: string,
): Promise<DbResult<{ eventId: string }>> {
    try {
        await db.calendar.delete(eventId);

        console.log('[Onda DB] Calendar event deleted:', eventId);
        return { success: true, data: { eventId } };
    } catch (error) {
        console.error('Failed to delete calendar event:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Get all calendar events within a date range
 * @param startDate - Start date string in format 'YYYY-MM-DD'
 * @param endDate - End date string in format 'YYYY-MM-DD'
 * @returns DbResult with array of calendar entries in the range
 * @example
 * // Success:
 * { success: true, data: [{ id: '1', title: 'Meeting', date: '2026-01-15', ... }] }
 *
 * // Error:
 * { success: false, error: 'Failed to fetch events in range' }
 */
export async function getCalendarEventsInRange(
    startDate: string,
    endDate: string,
): Promise<DbResult<CalendarEntry[]>> {
    try {
        const data = await db.calendar
            .where('date')
            .between(startDate, endDate, true, true)
            .toArray();

        return { success: true, data };
    } catch (error) {
        console.error(
            `Failed to fetch events between ${startDate} and ${endDate}:`,
            error,
        );
        return { success: false, error: (error as Error).message };
    }
}
