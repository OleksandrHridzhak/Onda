import { DAYS } from 'features/columns/utils/tableLayout';
import type { TaskTableColumn as TaskTableColumnType } from 'features/columns/types/types';
import { TaskTableEditor } from './TaskTableEditor';
import { ColumnHeader } from '../shared/ColumnHeader';

interface TaskTableColumnProps {
    column: TaskTableColumnType;
    archivedAt: Date;
}

/**
 * TaskTableColumn component
 * Displays a task table with available tags that can be marked as complete/incomplete.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export function TaskTableColumn({
    column,
    archivedAt,
}: TaskTableColumnProps): React.ReactElement {
    // Note: TaskTableColumn doesn't use DayColumnLayout because the task list
    // spans all days (rowSpan={DAYS.length}), unlike day-based columns
    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader column={column} archivedAt={archivedAt} />
            <tbody className="bg-surface">
                <tr>
                    <td
                        className="px-2 py-3 text-sm text-text todo-cell"
                        style={{ verticalAlign: 'top' }}
                        rowSpan={DAYS.length}
                    >
                        <TaskTableEditor column={column} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
