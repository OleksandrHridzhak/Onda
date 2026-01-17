import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { TodoCell } from './TodoCell';
import { DAYS } from '../../TableLogic';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import {
    TodoListColumn as TodoListColumnType,
    Todo,
} from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';

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

    // Map new Dexie Todo format to legacy TodoCell format
    // We include the id as a custom property to track todos across changes
    const todosForCell = (column.uniqueProps.todos || []).map((todo) => ({
        text: todo.text,
        completed: todo.done,
        category: todo.categoryId
            ? column.uniqueProps.availableCategories?.find(
                  (cat) => cat.id === todo.categoryId,
              )?.name
            : undefined,
        // Include ID for tracking (not used by TodoCell but preserved in state)
        _id: todo.id,
    }));

    // Map legacy TodoCell format back to new Dexie Todo format
    const handleTodosChange = (
        newTodos: Array<{
            text: string;
            completed: boolean;
            category?: string;
            _id?: string;
        }>,
    ) => {
        const todosForDb: Todo[] = newTodos.map((todo) => {
            const categoryId = todo.category
                ? column.uniqueProps.availableCategories?.find(
                      (cat) => cat.name === todo.category,
                  )?.id
                : undefined;

            return {
                // Preserve existing ID or generate new UUID (same as createColumn helper)
                id: todo._id || crypto.randomUUID(),
                text: todo.text,
                done: todo.completed,
                categoryId,
            };
        });

        updateColumnFields(columnId, {
            'uniqueProps.todos': todosForDb,
        });
    };

    // Note: TodoColumn doesn't use DayColumnLayout because the todo list
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
                        <TodoCell
                            value={todosForCell}
                            onChange={handleTodosChange}
                            column={{
                                id: columnId,
                                type: column.type,
                                options:
                                    column.uniqueProps.availableCategories?.map(
                                        (cat) => cat.name,
                                    ) || [],
                                tagColors:
                                    column.uniqueProps.availableCategories?.reduce(
                                        (acc, cat) => ({
                                            ...acc,
                                            [cat.name]: cat.color,
                                        }),
                                        {},
                                    ) || {},
                            }}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
