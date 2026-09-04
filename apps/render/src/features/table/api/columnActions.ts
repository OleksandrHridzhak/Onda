import { api } from "shared/api/client";
import type { DbResult } from "@onda/shared";

export async function archiveColumn(
  columnId: string,
  archivedAt: Date,
): Promise<DbResult<{ columnId: string }>> {
  return api.columns.archive(columnId, archivedAt.toISOString());
}

export async function permanentlyDeleteColumn(
  columnId: string,
): Promise<DbResult<{ columnId: string }>> {
  return api.columns.delete(columnId);
}

export async function moveColumn(
  columnId: string,
  direction: "left" | "right",
): Promise<DbResult<{ columnsOrder: string[] }>> {
  return api.columns.move(columnId, direction);
}
