import {
    DAYS,
    type TodoListColumn as TodoListColumnType,
} from 'entities/Column';
import { TodoListEditor } from 'features/UpdateColumnEntry';
import { ColumnHeader } from '../ColumnHeader';

interface TodoColumnProps {
    column: TodoListColumnType;
    archivedAt: Date;
}

/**
 * TodoColumn component
 * Displays a todo list that spans all days of the week.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export function TodoColumn({
    column,
    archivedAt,
}: TodoColumnProps): React.ReactElement {
    // Note: TodoColumn doesn't use DayColumnLayout because the todo list
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
                        <TodoListEditor column={column} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
