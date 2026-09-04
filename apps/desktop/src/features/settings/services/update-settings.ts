import { prisma } from "../../../core/lib/database";
import { safeJsonStringify } from "../../../core/utils";
import type { Setting, DbResult } from "@onda/shared";
import { getSettings } from "./get-settings";

export async function updateSettings(
  updates: Partial<Omit<Setting, "id">>,
): Promise<DbResult<{ updatedCount: number }>> {
  try {
    const current = await getSettings();
    const newLayout = updates.layout ||
      current.data?.layout || { columnsOrder: [] };

    await prisma.setting.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        layout: safeJsonStringify(newLayout),
      },
      update: {
        layout: safeJsonStringify(newLayout),
      },
    });

    return { success: true, data: { updatedCount: 1 } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

