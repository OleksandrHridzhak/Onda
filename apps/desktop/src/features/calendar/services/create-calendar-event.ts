import { prisma } from '../../../core/database';
import type { CalendarEntry, DbResult } from '@onda/shared';
import crypto from 'node:crypto';
import { serializeCalendarEvent } from './get-calendar-events';

export async function createCalendarEvent(event: Omit<CalendarEntry, 'id'>): Promise<DbResult<CalendarEntry>> {
    try {
        const id = crypto.randomUUID();
        const created = await prisma.calendarEvent.create({
            data: {
                id,
                title: event.title,
                color: event.color,
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                isRepeating: event.isRepeating ?? false,
                repeatDays: event.repeatDays ? JSON.stringify(event.repeatDays) : null,
                repeatFrequency: event.repeatFrequency || null,
            },
        });
        return { success: true, data: serializeCalendarEvent(created) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
