import React from "react";
import { ColumnWrapper } from "./shared/ColumnWrapper";
import { DayBasedColumn } from "./DayBasedColumn";
import { FullWeekColumn } from "./FullWeekColumn";
import { COLUMN_TYPES } from "../../types/columnDefinitions";
import type { Column } from "../../types/columnTypes";
import type { ColumnEntryValueMap } from "../../types/entryTypes";
import { useTableWeek } from "../../hooks/useTableWeek";

const FULL_WEEK_COLUMN_TYPES = new Set<string>([
  COLUMN_TYPES.TODO,
  COLUMN_TYPES.TASK_TABLE,
]);

export interface DynamicColumnsProps {
  columns: Column[];
  weekEntriesByBlock: Record<string, ColumnEntryValueMap>;
}

/**
 * DynamicColumns component
 * Responsible for rendering the dynamic core of user-defined columns.
 * Maps over visible columns and routes each to DayBasedColumn or FullWeekColumn inside ColumnWrapper.
 */
export const DynamicColumns = ({
  columns,
  weekEntriesByBlock,
}: DynamicColumnsProps) => {
  const { weekDates } = useTableWeek();

  return (
    <>
      {columns.map((column) => (
        <ColumnWrapper
          key={column.id}
          column={column}
          className="border-r border-border"
        >
          {FULL_WEEK_COLUMN_TYPES.has(column.type) ? (
            <FullWeekColumn column={column} />
          ) : (
            <DayBasedColumn
              column={column}
              weekDates={weekDates}
              weekEntriesByDate={weekEntriesByBlock[column.id] || {}}
            />
          )}
        </ColumnWrapper>
      ))}
    </>
  );
};

export default DynamicColumns;
