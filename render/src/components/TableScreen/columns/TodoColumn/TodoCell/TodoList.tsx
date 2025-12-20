import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { getColorOptions } from '../../../../utils/colorOptions';
import {
  handleToggleTodo,
  handleDeleteTodo,
  handleEditTodo,
  handleSaveEdit,
} from './logic';

interface Todo {
  text: string;
  completed: boolean;
  category?: string;
}

interface TodoListProps {
  todos: Todo[];
  filteredTodos: Todo[];
  column: {
    tagColors?: Record<string, string>;
  };
  darkMode: boolean;
  isEditing: boolean;
  editingIndex: number;
  editText: string;
  editCategory: string;
  setTodos: (todos: Todo[]) => void;
  setIsEditing: (editing: boolean) => void;
  setEditingIndex: (index: number) => void;
  setEditText: (text: string) => void;
  setEditCategory: (category: string) => void;
  onChange: (value: Todo[]) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filteredTodos,
  column,
  darkMode,
  isEditing,
  editingIndex,
  editText,
  editCategory,
  setTodos,
  setIsEditing,
  setEditingIndex,
  setEditText,
  setEditCategory,
  onChange,
}) => {
  const colorOptions = getColorOptions({ darkMode });

  return (
    <div
      className={`flex-1 overflow-y-auto overflow-x-hidden max-h-[310px] mt-0 ${
        darkMode ? 'custom-scroll-thin-dark' : 'custom-scroll-thin-light'
      }`}
    >
      {filteredTodos.map((todo, index) => (
        <div
          key={index}
          className={`group flex items-center justify-between p-2 rounded-md ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } ${index !== filteredTodos.length - 1 ? 'mb-[2px]' : ''} relative`}
        >
          <div className="flex items-center flex-1 min-w-0 w-full">
            <button
              onClick={() =>
                handleToggleTodo(
                  todos.findIndex((t) => t === todo),
                  todos,
                  setTodos,
                  onChange,
                )
              }
              className={`mr-2 p-1 rounded-full z-20 ${
                todo.completed
                  ? darkMode
                    ? 'bg-green-600 text-white'
                    : 'bg-green-500 text-white'
                  : darkMode
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Check size={14} />
            </button>
            {isEditing &&
            editingIndex === todos.findIndex((t) => t === todo) ? (
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    handleSaveEdit(
                      editingIndex,
                      editText,
                      editCategory,
                      todos,
                      setTodos,
                      onChange,
                      setIsEditing,
                      setEditingIndex,
                      setEditText,
                      setEditCategory,
                    )
                  }
                  onBlur={() =>
                    handleSaveEdit(
                      editingIndex,
                      editText,
                      editCategory,
                      todos,
                      setTodos,
                      onChange,
                      setIsEditing,
                      setEditingIndex,
                      setEditText,
                      setEditCategory,
                    )
                  }
                  className="flex-1 px-2 py-1 text-sm rounded-md z-20 bg-[var(--table-body-bg)] text-[var(--text)] border border-[var(--border)] focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none focus:outline-none min-w-0"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center flex-1 min-w-0 w-full gap-2">
                <div
                  className={`
                    flex-1 min-w-0 w-full
                    text-sm
                    ${
                      todo.completed
                        ? darkMode
                          ? 'text-gray-500 line-through'
                          : 'text-gray-400 line-through'
                        : darkMode
                          ? 'text-gray-200'
                          : 'text-gray-700'
                    }
                    transition-opacity
                    duration-150
                    group-hover:opacity-0
                    break-words
                    overflow-hidden
                    whitespace-pre-line
                    cursor-default
                    z-10
                  `}
                  style={{ wordBreak: 'break-word' }}
                >
                  {todo.text}
                </div>
                {todo.category && column?.tagColors?.[todo.category] && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      colorOptions.find(
                        (c) => c.name === column.tagColors[todo.category],
                      )?.bg
                    } ${colorOptions.find((c) => c.name === column.tagColors[todo.category])?.text}`}
                  >
                    {todo.category}
                  </span>
                )}
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="flex space-x-1 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-full justify-center z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEditTodo(
                    todos.findIndex((t) => t === todo),
                    todos,
                    setIsEditing,
                    setEditingIndex,
                    setEditText,
                    setEditCategory,
                  );
                }}
                className={`p-2 rounded-md flex items-center justify-center ${
                  darkMode
                    ? 'bg-gray-800 text-gray-400 hover:text-gray-200'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteTodo(
                    todos.findIndex((t) => t === todo),
                    todos,
                    setTodos,
                    onChange,
                  );
                }}
                className={`p-2  rounded-md flex items-center justify-center ${
                  darkMode
                    ? 'bg-gray-800 text-red-400 hover:text-red-300'
                    : 'bg-gray-100 text-red-500 hover:text-red-700'
                }`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
