import type { MultiCheckboxColumn } from "../../../types/columnTypes";
import { upsertDayEntry } from "features/table/api/columnEntries";
import type { ColumnEntrySnapshot } from "features/table/types/entryTypes";
import { MultiCheckboxCell } from "./MultiCheckBoxCell";
import type { EntryEditorProps } from "features/table/types/updateTypes";

export function MultiCheckboxEntryEditor({
  column,
  dateKey,
  entry,
}: EntryEditorProps<MultiCheckboxColumn>): React.ReactElement {
  const selectedOptionIds = (entry?.value as string[]) || [];

  const handleChange = (optionIds: string[]): void => {
    const selectedSnapshots: ColumnEntrySnapshot[] = optionIds
      .map((optionId) =>
        column.uniqueProps.availableOptions.find(
          (option) => option.id === optionId,
        ),
      )
      .filter((option): option is NonNullable<typeof option> => Boolean(option))
      .map(({ id, name, color }) => ({ id, name, color }));

    void upsertDayEntry({
      columnId: column.id,
      dayDate: dateKey,
      valueType: "optionIds",
      value: optionIds,
      meta: { selectedSnapshots },
    });
  };

  return (
    <MultiCheckboxCell
      selectedOptionIds={selectedOptionIds}
      onChange={handleChange}
      availableOptions={column.uniqueProps.availableOptions}
      selectedSnapshots={entry?.meta?.selectedSnapshots || []}
    />
  );
}
