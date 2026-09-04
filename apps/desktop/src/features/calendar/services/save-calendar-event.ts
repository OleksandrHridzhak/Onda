import { prisma } from "../../../core/lib/database";
import type { CalendarEntry, DbResult } from "@onda/shared";
import crypto from "node:crypto";
import { serializeCalendarEvent } from "./get-calendar-events";

export async function saveCalendarEvent(
  event: CalendarEntry | Omit<CalendarEntry, "id">,
): Promise<DbResult<CalendarEntry>> {
  try {
    const id = "id" in event && event.id ? event.id : crypto.randomUUID();
    const eventData = {
      title: event.title,
      color: event.color,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      isRepeating: event.isRepeating ?? false,
      repeatDays: event.repeatDays ? JSON.stringify(event.repeatDays) : null,
      repeatFrequency: event.repeatFrequency || null,
    };

    const saved = await prisma.calendarEvent.upsert({
      where: { id },
      create: { id, ...eventData },
      update: eventData,
    });
    return { success: true, data: serializeCalendarEvent(saved) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
