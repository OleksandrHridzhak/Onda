import React from 'react';
import { useSelector } from 'react-redux';
import { getColorOptions } from '../../../../../../utils/colorOptions';
import { useTodoState } from './hooks/useTodoState';
import { filterTodos } from './logic';
import { TodoInput } from './TodoInput';
import { TodoCategoryFilter } from './TodoCategoryFilter';
import { TodoList } from './TodoList';
import { Todo, Tag } from '../../../../../../types/newColumn.types';

interface RootState {
    newTheme: {
        themeMode: string;
    };
    theme: {
        mode: string;
    };
    pomodoro: unknown;
}

interface TodoCellProps {
    value: Todo[];
    onChange: (value: Todo[]) => void;
    availableCategories: Tag[];
    columnId: string;
}

/**
 * TodoCell component
 * Manages the todo list UI with add, edit, delete, and filter functionality.
 * Uses the new Dexie Todo format with proper ID tracking.
 */
export const TodoCell: React.FC<TodoCellProps> = ({
    value,
    onChange,
    availableCategories,
    columnId,
}) => {
    const { themeMode } = useSelector((state: RootState) => state.newTheme);
    const darkMode = themeMode === 'dark';
    const colorOptions = getColorOptions({ darkMode });

    const {
        todos,
        setTodos,
        newTodo,
        setNewTodo,
        newCategoryId,
        setNewCategoryId,
        isEditing,
        setIsEditing,
        editingId,
        setEditingId,
        editText,
        setEditText,
        editCategoryId,
        setEditCategoryId,
        selectedFilterCategoryId,
        setSelectedFilterCategoryId,
    } = useTodoState(value);

    const filteredTodos = filterTodos(todos, selectedFilterCategoryId);

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col gap-2 mb-2">
                <TodoInput
                    newTodo={newTodo}
                    setNewTodo={setNewTodo}
                    newCategoryId={newCategoryId}
                    todos={todos}
                    setTodos={setTodos}
                    onChange={onChange}
                    darkMode={darkMode}
                />
                <TodoCategoryFilter
                    availableCategories={availableCategories}
                    darkMode={darkMode}
                    selectedFilterCategoryId={selectedFilterCategoryId}
                    setSelectedFilterCategoryId={setSelectedFilterCategoryId}
                    setNewCategoryId={setNewCategoryId}
                />
            </div>
            <TodoList
                todos={todos}
                filteredTodos={filteredTodos}
                availableCategories={availableCategories}
                darkMode={darkMode}
                isEditing={isEditing}
                editingId={editingId}
                editText={editText}
                editCategoryId={editCategoryId}
                setTodos={setTodos}
                setIsEditing={setIsEditing}
                setEditingId={setEditingId}
                setEditText={setEditText}
                setEditCategoryId={setEditCategoryId}
                onChange={onChange}
            />
        </div>
    );
};
