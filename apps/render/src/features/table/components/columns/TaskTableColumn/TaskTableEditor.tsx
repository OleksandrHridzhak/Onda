import type { Tag, TaskTableColumn } from "../../../types/columnTypes";
import { updateColumnFields } from "../../../api/updateColumnFields";
import { TaskTableCell } from "./TaskTableCell";

interface TaskTableEditorProps {
  column: TaskTableColumn;
}

export function TaskTableEditor({
  column,
}: TaskTableEditorProps): React.ReactElement {
  const handleChange = (availableTags: Tag[], doneTasks: string[]): void => {
    void updateColumnFields(column.id, {
      "uniqueProps.availableTags": availableTags,
      "uniqueProps.doneTasks": doneTasks,
    });
  };

  return (
    <TaskTableCell
      availableTags={column.uniqueProps.availableTags}
      doneTasks={column.uniqueProps.doneTasks}
      onChange={handleChange}
    />
  );
}
