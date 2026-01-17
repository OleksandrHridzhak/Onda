import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { TaskTableCell } from '.';
import { DAYS } from '../../TableLogic';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { TaskTableColumn as TaskTableColumnType } from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';

interface TaskTableColumnProps {
    columnId: string;
}

/**
 * TaskTableColumn component
 * Displays a task table with available tags that can be marked as complete/incomplete.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export const TaskTableColumn: React.FC<TaskTableColumnProps> = ({
    columnId,
}) => {
    const { column, isLoading, isError } =
        useReactiveColumn<TaskTableColumnType>(columnId, 'taskTableColumn');

    // TODO: Try to add skeleton loading state later
    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const handleTasksChange = (
        availableTags: typeof column.uniqueProps.availableTags,
        doneTasks: string[],
    ) => {
        updateColumnFields(columnId, {
            'uniqueProps.availableTags': availableTags,
            'uniqueProps.doneTasks': doneTasks,
        });
    };

    // Note: TaskTableColumn doesn't use DayColumnLayout because the task list
    // spans all days (rowSpan={DAYS.length}), unlike day-based columns
    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader columnId={columnId} />
            <tbody className="bg-tableBodyBg">
                <tr>
                    <td
                        className="px-2 py-3 text-sm text-textTableRealValues todo-cell"
                        style={{ verticalAlign: 'top' }}
                        rowSpan={DAYS.length}
                    >
                        <TaskTableCell
                            availableTags={column.uniqueProps.availableTags}
                            doneTasks={column.uniqueProps.doneTasks}
                            onChange={handleTasksChange}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
