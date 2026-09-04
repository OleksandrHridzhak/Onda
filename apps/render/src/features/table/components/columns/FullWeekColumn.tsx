import React from "react";
import { ColumnHeader } from "./shared/ColumnHeader";
import type { Column } from "../../types/columnTypes";
import { COLUMN_TYPES } from "../../types/columnDefinitions";
import { TodoListEditor } from "../cells/TodoCell/TodoListEditor";
import { TaskTableEditor } from "../cells/TaskTableCell/TaskTableEditor";

const FULL_WEEK_EDITORS: Record<string, React.ComponentType<any>> = {
  [COLUMN_TYPES.TODO]: TodoListEditor,
  [COLUMN_TYPES.TASK_TABLE]: TaskTableEditor,
};

interface FullWeekColumnProps {
  column: Column;
}

/**
 * Shared wrapper for all full-week columns (TodoList, TaskTable).
 * Uses CSS Grid layout (header 45px, content 1fr) with simple div ColumnHeader.
 */
export const FullWeekColumn = ({ column }: FullWeekColumnProps) => {
  const Editor = FULL_WEEK_EDITORS[column.type];
  if (!Editor) return null;

  return (
    <div className="checkbox-nested-table grid grid-rows-[45px_1fr] h-full font-poppins">
      <ColumnHeader column={column} />
      <div className="bg-surface px-2 py-3 text-sm text-text todo-cell min-h-0 overflow-y-auto">
        <Editor column={column} />
      </div>
    </div>
  );
};
