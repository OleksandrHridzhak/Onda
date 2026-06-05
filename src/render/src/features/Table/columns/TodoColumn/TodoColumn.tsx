import React from 'react';
import { ColumnHeader } from 'features/Table/columns/ColumnHeader';
import { TodoCell } from 'features/Table/columns/TodoColumn/TodoCell';
import { DAYS } from 'features/Table/TableLogic';
import { updateColumnFields } from 'db/helpers/columns';
import {
    TodoListColumn as TodoListColumnType,
    Todo,
} from 'app/types/newColumn.types';
import { useReactiveColumn } from 'features/Table/hooks/useReactiveColumn';

interface TodoColumnProps {
    columnId: string;
}

/**
 * TodoColumn component
 * Displays a todo list that spans all days of the week.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export const TodoColumn: React.FC<TodoColumnProps> = ({ columnId }) => {
    const { column, isLoading, isError } =
        useReactiveColumn<TodoListColumnType>(columnId, 'todoListColumn');

    // TODO: Try to add skeleton loading state later
    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const handleTodosChange = (newTodos: Todo[]) => {
        updateColumnFields(columnId, {
            'uniqueProps.todos': newTodos,
        });
    };

    // Note: TodoColumn doesn't use DayColumnLayout because the todo list
    // spans all days (rowSpan={DAYS.length}), unlike day-based columns
    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader columnId={columnId} />
            <tbody className="bg-surface">
                <tr>
                    <td
                        className="px-2 py-3 text-sm text-text todo-cell"
                        style={{ verticalAlign: 'top' }}
                        rowSpan={DAYS.length}
                    >
                        <TodoCell
                            value={column.uniqueProps.todos || []}
                            onChange={handleTodosChange}
                            availableCategories={
                                column.uniqueProps.availableCategories || []
                            }
                            columnId={columnId}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
