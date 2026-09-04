import React from 'react';
import { ColumnHeader } from './shared/ColumnHeader';
import { DAYS } from '../../utils/tableLayout';
import type { Column } from '../../types/columnTypes';
import { COLUMN_TYPES } from '../../types/columnDefinitions';
import { TodoListEditor } from './TodoColumn/TodoListEditor';
import { TaskTableEditor } from './TaskTableColumn/TaskTableEditor';

const FULL_WEEK_EDITORS: Record<string, React.ComponentType<any>> = {
    [COLUMN_TYPES.TODO]: TodoListEditor,
    [COLUMN_TYPES.TASK_TABLE]: TaskTableEditor,
};

interface FullWeekColumnProps {
    column: Column;
    archivedAt: Date;
}

/**
 * Shared wrapper for all full-week columns (TodoList, TaskTable).
 * Renders the exact same table, ColumnHeader, and tbody rowSpan={7} as before.
 */
export const FullWeekColumn = ({ column, archivedAt }: FullWeekColumnProps) => {
    const Editor = FULL_WEEK_EDITORS[column.type];
    if (!Editor) return null;

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
                        <Editor column={column} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
