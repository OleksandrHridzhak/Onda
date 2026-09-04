import { api } from "shared/api/client";
import type { Setting, DbResult } from "@onda/shared";

export async function ensureDefaultSettings(): Promise<void> {
  await api.settings.get();
}

export async function getSettings(): Promise<DbResult<Setting>> {
  return api.settings.get();
}

export async function updateSettings(
  updates: Partial<Omit<Setting, "id">>,
): Promise<DbResult<{ updatedCount: number }>> {
  return api.settings.update(updates);
}

export async function updateColumnsOrder(
  columnIds: string[],
): Promise<DbResult<{ columnsOrder: string[] }>> {
  return api.settings.updateColumnsOrder(columnIds);
}

export async function getColumnsOrder(): Promise<DbResult<string[]>> {
  return api.settings.getColumnsOrder();
}
