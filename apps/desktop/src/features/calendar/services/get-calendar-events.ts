import { prisma } from "../../../core/lib/database";
import { safeJsonParse } from "../../../core/utils";
import type { CalendarEntry, DbResult } from "@onda/shared";

function serializeCalendarEvent(ev: any): CalendarEntry {
  return {
    id: ev.id,
    title: ev.title,
    color: ev.color,
    date: ev.date,
    startTime: ev.startTime,
    endTime: ev.endTime,
    isRepeating: ev.isRepeating ?? false,
    repeatDays: ev.repeatDays
      ? safeJsonParse<number[] | undefined>(ev.repeatDays, undefined)
      : undefined,
    repeatFrequency: ev.repeatFrequency || null,
  };
}

export { serializeCalendarEvent };

export async function getCalendarEvents(): Promise<DbResult<CalendarEntry[]>> {
  try {
    const events = await prisma.calendarEvent.findMany();
    return { success: true, data: events.map(serializeCalendarEvent) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
