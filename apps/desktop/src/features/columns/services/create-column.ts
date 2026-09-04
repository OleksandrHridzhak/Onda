import { prisma } from "../../../core/lib/database";
import { safeJsonParse, safeJsonStringify } from "../../../core/utils";
import type { Column, DbResult } from "@onda/shared";
import crypto from "node:crypto";
import { serializeColumn } from "./get-columns";

export async function createColumn(
  column: Omit<Column, "id"> & { id?: string },
): Promise<DbResult<Column>> {
  try {
    const id = column.id || crypto.randomUUID();

    const created = await prisma.$transaction(async (tx) => {
      const settings = await tx.setting.findUnique({
        where: { id: "global" },
      });

      const layout = settings
        ? safeJsonParse<{ columnsOrder: string[] }>(settings.layout, {
            columnsOrder: [],
          })
        : { columnsOrder: [] };

      const nextOrder = layout.columnsOrder.length;

      const col = await tx.column.create({
        data: {
          id,
          name: column.name,
          isNameVisible:
            column.isNameVisible !== undefined ? column.isNameVisible : true,
          description: column.description || "",
          emojiIconName: column.emojiIconName || "Star",
          width: column.width || 200,
          type: column.type,
          uniqueProps: safeJsonStringify(column.uniqueProps || {}),
          createdAt: column.lifecycle?.createdAt
            ? new Date(column.lifecycle.createdAt)
            : new Date(),
          archivedAt: null,
          order: nextOrder,
        },
      });

      if (!layout.columnsOrder.includes(id)) {
        layout.columnsOrder.push(id);
        await tx.setting.upsert({
          where: { id: "global" },
          create: {
            id: "global",
            layout: safeJsonStringify(layout),
          },
          update: {
            layout: safeJsonStringify(layout),
          },
        });
      }

      return col;
    });

    return { success: true, data: serializeColumn(created) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
