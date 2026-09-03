import { prisma } from '../../../core/database';
import type { CalendarEntry, DbResult } from '@onda/shared';
import crypto from 'node:crypto';
import { serializeCalendarEvent } from './get-calendar-events';

export async function updateCalendarEvent(
    id: string,
    updates: Partial<Omit<CalendarEntry, 'id'>>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        const dataToUpdate: any = {};
        if (updates.title !== undefined) dataToUpdate.title = updates.title;
        if (updates.color !== undefined) dataToUpdate.color = updates.color;
        if (updates.date !== undefined) dataToUpdate.date = updates.date;
        if (updates.startTime !== undefined) dataToUpdate.startTime = updates.startTime;
        if (updates.endTime !== undefined) dataToUpdate.endTime = updates.endTime;
        if (updates.isRepeating !== undefined) dataToUpdate.isRepeating = updates.isRepeating;
        if (updates.repeatDays !== undefined) {
            dataToUpdate.repeatDays = updates.repeatDays ? JSON.stringify(updates.repeatDays) : null;
        }
        if (updates.repeatFrequency !== undefined) dataToUpdate.repeatFrequency = updates.repeatFrequency;

        await prisma.calendarEvent.update({
            where: { id },
            data: dataToUpdate,
        });
        return { success: true, data: { updatedCount: 1 } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function saveCalendarEvent(
    event: CalendarEntry | Omit<CalendarEntry, 'id'>,
): Promise<DbResult<CalendarEntry>> {
    try {
        const id = 'id' in event && event.id ? event.id : crypto.randomUUID();
        const saved = await prisma.calendarEvent.upsert({
            where: { id },
            create: {
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
            update: {
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
        return { success: true, data: serializeCalendarEvent(saved) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
