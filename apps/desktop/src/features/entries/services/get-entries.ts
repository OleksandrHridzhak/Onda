import { prisma } from "../../../core/lib/database";
import { safeJsonParse } from "../../../core/utils";
import type { ColumnEntry, DbResult } from "@onda/shared";

function serializeEntry(entry: any): ColumnEntry {
  const val = safeJsonParse(entry.value, entry.value);
  const meta = entry.meta ? safeJsonParse(entry.meta, undefined) : undefined;

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
