import React from 'react';
import { useSelector } from 'react-redux';
import { getColorOptions } from '../../../../../utils/colorOptions';
import { useTodoState } from './hooks/useTodoState';
import { filterTodos } from './logic';
import { TodoInput } from './TodoInput';
import { TodoCategoryFilter } from './TodoCategoryFilter';
import { TodoList } from './TodoList';

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
  value: Array<{ text: string; completed: boolean; category?: string }>;
  column: {
    id: string;
    type: string;
    options?: string[];
    tagColors?: Record<string, string>;
  };
  onChange: (
    value: Array<{ text: string; completed: boolean; category?: string }>,
  ) => void;
}

export const TodoCell: React.FC<TodoCellProps> = ({
  value,
  column,
  onChange,
}) => {
  const { themeMode } = useSelector((state: RootState) => state.newTheme);
  const darkMode = themeMode === 'dark' ? true : false;
  const colorOptions = getColorOptions({ darkMode });

  const {
    todos,
    setTodos,
    newTodo,
    setNewTodo,
    newCategory,
    setNewCategory,
    isEditing,
    setIsEditing,
    editingIndex,
    setEditingIndex,
    editText,
    setEditText,
    editCategory,
    setEditCategory,
    selectedFilterCategory,
    setSelectedFilterCategory,
  } = useTodoState(value);

  const filteredTodos = filterTodos(todos, selectedFilterCategory);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-2 mb-2">
        <TodoInput
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          newCategory={newCategory}
          todos={todos}
          setTodos={setTodos}
          onChange={onChange}
          darkMode={darkMode}
        />
        <TodoCategoryFilter
          column={column}
          darkMode={darkMode}
          selectedFilterCategory={selectedFilterCategory}
          setSelectedFilterCategory={setSelectedFilterCategory}
          setNewCategory={setNewCategory}
        />
      </div>
      <TodoList
        todos={todos}
        filteredTodos={filteredTodos}
        column={column}
        darkMode={darkMode}
        isEditing={isEditing}
        editingIndex={editingIndex}
        editText={editText}
        editCategory={editCategory}
        setTodos={setTodos}
        setIsEditing={setIsEditing}
        setEditingIndex={setEditingIndex}
        setEditText={setEditText}
        setEditCategory={setEditCategory}
        onChange={onChange}
      />
    </div>
  );
};
