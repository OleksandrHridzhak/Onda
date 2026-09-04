import { prisma } from "../../../core/lib/database";
import type { DbResult } from "@onda/shared";

export async function clearAllData(): Promise<DbResult<boolean>> {
  try {
    await prisma.$transaction([
      prisma.columnEntry.deleteMany(),
      prisma.calendarEvent.deleteMany(),
      prisma.column.deleteMany(),
      prisma.setting.deleteMany(),
    ]);

    // Re-create empty default settings
    await prisma.setting.create({
      data: {
        id: "global",
        layout: JSON.stringify({ columnsOrder: [] }),
      },
    });

    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
