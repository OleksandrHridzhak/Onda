import { prisma } from "../../../core/lib/database";
import { safeJsonParse, safeJsonStringify } from "../../../core/utils";
import type { DbResult } from "@onda/shared";

export async function deleteColumn(
  id: string,
): Promise<DbResult<{ columnId: string }>> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.columnEntry.deleteMany({ where: { columnId: id } });
      await tx.column.delete({ where: { id } });

      const settings = await tx.setting.findUnique({
        where: { id: "global" },
      });
      if (settings) {
        const layout = safeJsonParse<{ columnsOrder: string[] }>(
          settings.layout,
          { columnsOrder: [] },
        );
        layout.columnsOrder = layout.columnsOrder.filter((cid) => cid !== id);
        await tx.setting.update({
          where: { id: "global" },
          data: { layout: safeJsonStringify(layout) },
        });

        for (let i = 0; i < layout.columnsOrder.length; i++) {
          await tx.column.updateMany({
            where: { id: layout.columnsOrder[i] },
            data: { order: i },
          });
        }
      }
    });

    return { success: true, data: { columnId: id } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
