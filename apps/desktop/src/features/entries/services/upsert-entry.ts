import { prisma } from "../../../core/lib/database";
import { safeJsonStringify } from "../../../core/utils";
import type { ColumnEntry, DbResult, UpsertDayEntryInput } from "@onda/shared";
import { serializeEntry } from "./get-entries";

function getUtcMondayFromDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = (dateObj.getUTCDay() + 6) % 7; // Monday = 0
  dateObj.setUTCDate(dateObj.getUTCDate() - dayOfWeek);
  return dateObj.toISOString().split("T")[0];
}

export async function upsertDayEntry(
  input: UpsertDayEntryInput,
): Promise<DbResult<ColumnEntry>> {
  try {
    const { columnId, dayDate, valueType, value, meta } = input;

    const weekStart = getUtcMondayFromDateKey(dayDate);
    const serializedValue = safeJsonStringify(
      value !== undefined ? value : null,
      "null",
    );
    const serializedMeta = meta ? safeJsonStringify(meta, "null") : null;
    const entryId = `${columnId}_${dayDate}`;

    const entry = await prisma.columnEntry.upsert({
      where: {
        columnId_dateKey: {
          columnId,
          dateKey: dayDate,
        },
      },
      create: {
        id: entryId,
        columnId,
        scope: "day",
        dateKey: dayDate,
        dayDate,
        weekStart,
        valueType,
        value: serializedValue,
        meta: serializedMeta,
      },
      update: {
        valueType,
        value: serializedValue,
        meta: serializedMeta,
      },
    });

    return { success: true, data: serializeEntry(entry) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
