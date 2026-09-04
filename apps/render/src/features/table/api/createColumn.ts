import { COLUMN_DEFINITIONS } from "../types/columnDefinitions";
import type { ColumnType, Column, DbResult } from "@onda/shared";
import { api } from "shared/api/client";

export async function createColumn(
  type: ColumnType,
  createdAt?: Date,
): Promise<DbResult<Column>> {
  const definition = Object.values(COLUMN_DEFINITIONS).find(
    ({ template }) => template.type === type,
  );

  if (!definition) {
    return {
      success: false,
      error: `Definition for type "${type}" not found.`,
    };
  }

  const template = definition.template;
  const newColumn = {
    ...template,
    lifecycle: {
      createdAt: createdAt ? createdAt.toISOString() : null,
      archivedAt: null,
    },
  };

  return api.columns.create(newColumn);
}
