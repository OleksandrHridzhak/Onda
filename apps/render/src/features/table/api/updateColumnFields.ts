import { api } from "shared/api/client";
import type { DbResult } from "@onda/shared";

export async function updateColumnFields(
  columnId: string,
  changes: Record<string, unknown>,
): Promise<DbResult<{ updatedCount: number }>> {
  return api.columns.updateFields(columnId, changes);
}
