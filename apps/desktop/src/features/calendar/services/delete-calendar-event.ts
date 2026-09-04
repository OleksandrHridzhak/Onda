import { prisma } from "../../../core/lib/database";
import type { DbResult } from "@onda/shared";

export async function deleteCalendarEvent(
  id: string,
): Promise<DbResult<{ eventId: string }>> {
  try {
    await prisma.calendarEvent.delete({ where: { id } });
    return { success: true, data: { eventId: id } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
