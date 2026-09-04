import { prisma } from "../../../core/lib/database";
import { safeJsonParse, safeJsonStringify } from "../../../core/utils";
import type { DbResult } from "@onda/shared";

export async function moveColumn(
  columnId: string,
  direction: "left" | "right",
): Promise<DbResult<{ columnsOrder: string[] }>> {
  try {
    const settings = await prisma.setting.findUnique({
      where: { id: "global" },
    });
    if (!settings) return { success: false, error: "Settings not found" };

    const layout = safeJsonParse<{ columnsOrder: string[] }>(settings.layout, {
      columnsOrder: [],
    });

    const currentOrder = layout.columnsOrder;
    const cols = await prisma.column.findMany({
      where: { id: { in: currentOrder } },
    });
    const colMap = new Map(cols.map((c) => [c.id, c]));
    const activeOrder = currentOrder.filter((id) => {
      const c = colMap.get(id);
      return c && !c.archivedAt;
    });

    const currentIndex = activeOrder.indexOf(columnId);
    const nextIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex === -1 ||
      nextIndex < 0 ||
      nextIndex >= activeOrder.length
    ) {
      return {
        success: false,
        error: "Cannot move column further in that direction",
      };
    }

    const newOrder = [...currentOrder];
    const otherColumnId = activeOrder[nextIndex];
    const currentOrderIndex = newOrder.indexOf(columnId);
    const otherOrderIndex = newOrder.indexOf(otherColumnId);

    [newOrder[currentOrderIndex], newOrder[otherOrderIndex]] = [
      newOrder[otherOrderIndex],
      newOrder[currentOrderIndex],
    ];

    await prisma.$transaction(async (tx) => {
      await tx.setting.update({
        where: { id: "global" },
        data: {
          layout: safeJsonStringify({ ...layout, columnsOrder: newOrder }),
        },
      });

      for (let i = 0; i < newOrder.length; i++) {
        await tx.column.updateMany({
          where: { id: newOrder[i] },
          data: { order: i },
        });
      }
    });

    return { success: true, data: { columnsOrder: newOrder } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
