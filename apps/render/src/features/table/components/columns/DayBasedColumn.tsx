import React from "react";
import { formatDateKey } from "shared/lib/date";
import { ColumnHeader } from "./shared/ColumnHeader";
import type { Column } from "../../types/columnTypes";
import { COLUMN_TYPES } from "../../types/columnDefinitions";
import type { ColumnEntryValueMap } from "../../types/entryTypes";
import { CheckboxEntryEditor } from "../cells/CheckboxCell/CheckBoxCell";
import { NumberEntryEditor } from "../cells/NumberboxCell/NumberboxCell";
import { TextEntryEditor } from "../cells/TextboxCell/TextboxCell";
import { TagsEntryEditor } from "../cells/TagsCell/TagsEntryEditor";
import { MultiCheckboxEntryEditor } from "../cells/MultiCheckboxCell/MultiCheckboxEntryEditor";

const DAY_EDITORS: Record<string, React.ComponentType<any>> = {
  [COLUMN_TYPES.CHECKBOX]: CheckboxEntryEditor,
  [COLUMN_TYPES.NUMBERBOX]: NumberEntryEditor,
  [COLUMN_TYPES.TEXTBOX]: TextEntryEditor,
  [COLUMN_TYPES.TAGS]: TagsEntryEditor,
  [COLUMN_TYPES.MULTI_CHECKBOX]: MultiCheckboxEntryEditor,
};

const DAY_COLUMN_CLASSES: Record<string, string> = {
  [COLUMN_TYPES.CHECKBOX]: "column-checkbox",
  [COLUMN_TYPES.NUMBERBOX]: "column-numberbox",
  [COLUMN_TYPES.TEXTBOX]: "column-text",
  [COLUMN_TYPES.MULTI_CHECKBOX]: "column-multicheckbox",
};

interface DayBasedColumnProps {
  column: Column;
  weekDates: Date[];
  weekEntriesByDate: ColumnEntryValueMap;
}

/**
 * Shared wrapper for all 7-day columns (Checkbox, Numberbox, Textbox, Tags, MultiCheckbox).
 * Uses pure divs with Flexbox layout, no nested table elements.
 */
export const DayBasedColumn = ({
  column,
  weekDates,
  weekEntriesByDate,
}: DayBasedColumnProps) => {
  const Editor = DAY_EDITORS[column.type];
  if (!Editor) return null;

  const columnClass = DAY_COLUMN_CLASSES[column.type] || "";

  return (
    <div
      className={`checkbox-nested-table ${columnClass} font-poppins flex flex-col h-full w-full`}
    >
      <ColumnHeader column={column} />
      <div className="table-rows-container bg-surface flex flex-col w-full">
        {weekDates.map((date) => {
          const dateKey = formatDateKey(date);
          return (
            <div
              key={dateKey}
              className="table-day-row border-b border-border last:border-0 px-2 py-3 text-sm text-text flex items-center justify-center box-border w-full"
            >
              <Editor
                column={column}
                dateKey={dateKey}
                entry={weekEntriesByDate[dateKey]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
