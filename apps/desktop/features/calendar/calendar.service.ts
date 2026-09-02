import { getPrismaClient } from '../../core/database';
import type { CalendarEntry, DbResult } from '@onda/shared';
import crypto from 'node:crypto';

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

export const calendarService = {
    async getAll(): Promise<DbResult<CalendarEntry[]>> {
        try {
            const prisma = getPrismaClient();
            const events = await prisma.calendarEvent.findMany();
            return { success: true, data: events.map(serializeCalendarEvent) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getByDate(date: string): Promise<DbResult<CalendarEntry[]>> {
        try {
            const prisma = getPrismaClient();
            const events = await prisma.calendarEvent.findMany({ where: { date } });
            return { success: true, data: events.map(serializeCalendarEvent) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getById(id: string): Promise<DbResult<CalendarEntry>> {
        try {
            const prisma = getPrismaClient();
            const ev = await prisma.calendarEvent.findUnique({ where: { id } });
            if (!ev) return { success: false, error: `Calendar event ${id} not found` };
            return { success: true, data: serializeCalendarEvent(ev) };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async getInRange(startDate: string, endDate: string): Promise<DbResult<CalendarEntry[]>> {
        try {
            const prisma = getPrismaClient();
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
    },

    async create(event: Omit<CalendarEntry, 'id'>): Promise<DbResult<CalendarEntry>> {
        try {
            const prisma = getPrismaClient();
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
    },

    async update(id: string, updates: Partial<Omit<CalendarEntry, 'id'>>): Promise<DbResult<{ updatedCount: number }>> {
        try {
            const prisma = getPrismaClient();
            const dataToUpdate: any = {};
            if (updates.title !== undefined) dataToUpdate.title = updates.title;
            if (updates.color !== undefined) dataToUpdate.color = updates.color;
            if (updates.date !== undefined) dataToUpdate.date = updates.date;
            if (updates.startTime !== undefined) dataToUpdate.startTime = updates.startTime;
            if (updates.endTime !== undefined) dataToUpdate.endTime = updates.endTime;
            if (updates.isRepeating !== undefined) dataToUpdate.isRepeating = updates.isRepeating;
            if (updates.repeatDays !== undefined) dataToUpdate.repeatDays = updates.repeatDays ? JSON.stringify(updates.repeatDays) : null;
            if (updates.repeatFrequency !== undefined) dataToUpdate.repeatFrequency = updates.repeatFrequency;

            await prisma.calendarEvent.update({
                where: { id },
                data: dataToUpdate,
            });
            return { success: true, data: { updatedCount: 1 } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },

    async save(event: CalendarEntry | Omit<CalendarEntry, 'id'>): Promise<DbResult<CalendarEntry>> {
        try {
            const id = 'id' in event && event.id ? event.id : crypto.randomUUID();
            const prisma = getPrismaClient();
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
    },

    async delete(id: string): Promise<DbResult<{ eventId: string }>> {
        try {
            const prisma = getPrismaClient();
            await prisma.calendarEvent.delete({ where: { id } });
            return { success: true, data: { eventId: id } };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    },
};
