import { prisma } from '../../../core/database';
import type { CalendarEntry, DbResult } from '@onda/shared';

function serializeCalendarEvent(ev: any): CalendarEntry {
    let repeatDays: number[] | undefined = undefined;
    if (ev.repeatDays) {
        try {
            repeatDays = typeof ev.repeatDays === 'string' ? JSON.parse(ev.repeatDays) : ev.repeatDays;
        } catch {
            repeatDays = undefined;
        }
    }

    return {
        id: ev.id,
        title: ev.title,
        color: ev.color,
        date: ev.date,
        startTime: ev.startTime,
        endTime: ev.endTime,
        isRepeating: ev.isRepeating ?? false,
        repeatDays,
        repeatFrequency: ev.repeatFrequency || null,
    };
}

export { serializeCalendarEvent };

export async function getAllCalendarEvents(): Promise<DbResult<CalendarEntry[]>> {
    try {
        const events = await prisma.calendarEvent.findMany();
        return { success: true, data: events.map(serializeCalendarEvent) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getCalendarEventsByDate(date: string): Promise<DbResult<CalendarEntry[]>> {
    try {
        const events = await prisma.calendarEvent.findMany({ where: { date } });
        return { success: true, data: events.map(serializeCalendarEvent) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getCalendarEventById(id: string): Promise<DbResult<CalendarEntry>> {
    try {
        const ev = await prisma.calendarEvent.findUnique({ where: { id } });
        if (!ev) return { success: false, error: `Calendar event ${id} not found` };
        return { success: true, data: serializeCalendarEvent(ev) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getCalendarEventsInRange(startDate: string, endDate: string): Promise<DbResult<CalendarEntry[]>> {
    try {
        const events = await prisma.calendarEvent.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        return { success: true, data: events.map(serializeCalendarEvent) };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
