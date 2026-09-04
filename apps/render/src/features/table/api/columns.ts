import { api } from "shared/api/client";
import type { Column, DbResult } from "@onda/shared";

export async function getAllColumns(): Promise<DbResult<Column[]>> {
  return api.columns.getAll();
}

export async function getColumnById(
  columnId: string,
): Promise<DbResult<Column>> {
  return api.columns.getById(columnId);
}

export async function getColumnsByIds(
  columnIds: string[],
): Promise<(Column | undefined)[]> {
  const res = await api.columns.getByIds(columnIds);
  return res.success && res.data ? res.data : columnIds.map(() => undefined);
}
