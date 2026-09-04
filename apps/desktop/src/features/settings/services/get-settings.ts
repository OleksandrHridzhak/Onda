import { prisma } from "../../../core/lib/database";
import { safeJsonParse, safeJsonStringify } from "../../../core/utils";
import type { Setting, DbResult } from "@onda/shared";

export async function getSettings(): Promise<DbResult<Setting>> {
  try {
    let setting = await prisma.setting.findUnique({ where: { id: "global" } });
    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          id: "global",
          layout: safeJsonStringify({ columnsOrder: [] }),
        },
      });
    }
    const layout = safeJsonParse<{ columnsOrder: string[] }>(setting.layout, {
      columnsOrder: [],
    });
    return {
      success: true,
      data: {
        id: "global",
        layout,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

