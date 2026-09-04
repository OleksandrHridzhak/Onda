import { prisma } from "../../../core/lib/database";
import type { ColumnEntry, DbResult } from "@onda/shared";

function serializeEntry(entry: any): ColumnEntry {
  let val: any = null;
  try {
    val =
      typeof entry.value === "string" ? JSON.parse(entry.value) : entry.value;
  } catch {
    val = entry.value;
  }

  let meta: any = undefined;
  if (entry.meta) {
    try {
      meta =
        typeof entry.meta === "string" ? JSON.parse(entry.meta) : entry.meta;
    } catch {
      meta = undefined;
    }
  }

  return {
    id: entry.id,
    columnId: entry.columnId,
    scope: entry.scope as "day",
    dateKey: entry.dateKey,
    dayDate: entry.dayDate,
    weekStart: entry.weekStart,
    valueType: entry.valueType as any,
    value: val,
    meta,
    createdAt: new Date(entry.createdAt).toISOString(),
    updatedAt: new Date(entry.updatedAt).toISOString(),
  };
}

export { serializeEntry };

export async function getDayEntry(
  columnId: string,
  dayDate: string,
): Promise<DbResult<ColumnEntry | null>> {
  try {
    const entry = await prisma.columnEntry.findUnique({
      where: {
        columnId_dateKey: {
          columnId,
          dateKey: dayDate,
        },
      },
    });
    return { success: true, data: entry ? serializeEntry(entry) : null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getEntriesForWeek(
  weekStart: string,
): Promise<DbResult<ColumnEntry[]>> {
  try {
    const entries = await prisma.columnEntry.findMany({
      where: { weekStart },
    });
    return { success: true, data: entries.map(serializeEntry) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getEntriesForDateRange(
  startDate: string,
  endDate: string,
): Promise<DbResult<ColumnEntry[]>> {
  try {
    const entries = await prisma.columnEntry.findMany({
      where: {
        dateKey: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return { success: true, data: entries.map(serializeEntry) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
