import { prisma } from "../../../core/lib/database";
import type { Column, DbResult } from "@onda/shared";
import crypto from "node:crypto";
import { serializeColumn } from "./get-columns";

export async function createColumn(
  column: Omit<Column, "id"> & { id?: string },
): Promise<DbResult<Column>> {
  try {
    const id = column.id || crypto.randomUUID();
    const created = await prisma.column.create({
      data: {
        id,
        name: column.name,
        isNameVisible:
          column.isNameVisible !== undefined ? column.isNameVisible : true,
        description: column.description || "",
        emojiIconName: column.emojiIconName || "Star",
        width: column.width || 200,
        type: column.type,
        uniqueProps: JSON.stringify(column.uniqueProps || {}),
        createdAt: column.lifecycle?.createdAt
          ? new Date(column.lifecycle.createdAt)
          : new Date(),
        archivedAt: null,
      },
    });

    // Update columns order in settings
    const settings = await prisma.setting.findUnique({
      where: { id: "global" },
    });
    if (settings) {
      let layout = { columnsOrder: [] as string[] };
      try {
        layout = JSON.parse(settings.layout);
      } catch {
        layout = { columnsOrder: [] };
      }
      if (!layout.columnsOrder.includes(id)) {
        layout.columnsOrder.push(id);
        await prisma.setting.update({
          where: { id: "global" },
          data: { layout: JSON.stringify(layout) },
        });
      }
    }

    return { success: true, data: serializeColumn(created) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
