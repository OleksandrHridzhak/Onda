import { prisma } from "../../../core/lib/database";
import type { Column, DbResult } from "@onda/shared";

export async function updateColumnFields(
  id: string,
  fields: Record<string, any>,
): Promise<DbResult<{ updatedCount: number }>> {
  try {
    const dataToUpdate: any = {};
    if (fields.name !== undefined) dataToUpdate.name = fields.name;
    if (fields.isNameVisible !== undefined)
      dataToUpdate.isNameVisible = fields.isNameVisible;
    if (fields.description !== undefined)
      dataToUpdate.description = fields.description;
    if (fields.emojiIconName !== undefined)
      dataToUpdate.emojiIconName = fields.emojiIconName;
    if (fields.width !== undefined) dataToUpdate.width = fields.width;

    const uniquePropEntries = Object.entries(fields).filter(([key]) =>
      key.startsWith("uniqueProps."),
    );

    if (fields.uniqueProps !== undefined || uniquePropEntries.length > 0) {
      const existingColumn = await prisma.column.findUnique({
        where: { id },
        select: { uniqueProps: true },
      });

      let mergedUniqueProps: Record<string, unknown> = {};
      if (existingColumn?.uniqueProps) {
        try {
          mergedUniqueProps = JSON.parse(existingColumn.uniqueProps);
        } catch {
          mergedUniqueProps = {};
        }
      }

      if (
        typeof fields.uniqueProps === "object" &&
        fields.uniqueProps !== null
      ) {
        mergedUniqueProps = { ...mergedUniqueProps, ...fields.uniqueProps };
      }

      for (const [key, value] of uniquePropEntries) {
        const subKey = key.slice("uniqueProps.".length);
        mergedUniqueProps[subKey] = value;
      }

      dataToUpdate.uniqueProps = JSON.stringify(mergedUniqueProps);
    }

    if (fields.lifecycle?.archivedAt !== undefined) {
      dataToUpdate.archivedAt = fields.lifecycle.archivedAt
        ? new Date(fields.lifecycle.archivedAt)
        : null;
    }

    await prisma.column.update({
      where: { id },
      data: dataToUpdate,
    });

    return { success: true, data: { updatedCount: 1 } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function archiveColumn(
  id: string,
): Promise<DbResult<{ columnId: string }>> {
  try {
    await prisma.column.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
    return { success: true, data: { columnId: id } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
