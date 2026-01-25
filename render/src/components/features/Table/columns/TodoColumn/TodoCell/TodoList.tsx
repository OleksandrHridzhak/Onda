import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { getColorOptions } from '../../../../../../utils/colorOptions';
import {
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    handleSaveEdit,
} from './logic';
import { Todo, Tag } from '../../../../../../types/newColumn.types';

interface TodoListProps {
    todos: Todo[];
    filteredTodos: Todo[];
    availableCategories: Tag[];
    darkMode: boolean;
    isEditing: boolean;
    editingId: string | null;
    editText: string;
    editCategoryId: string;
    setTodos: (todos: Todo[]) => void;
    setIsEditing: (editing: boolean) => void;
    setEditingId: (id: string | null) => void;
    setEditText: (text: string) => void;
    setEditCategoryId: (categoryId: string) => void;
    onChange: (value: Todo[]) => void;
}

/**
 * TodoList component
 * Displays the list of todos with edit, delete, and toggle functionality
 */
export const TodoList: React.FC<TodoListProps> = ({
    todos,
    filteredTodos,
    availableCategories,
    darkMode,
    isEditing,
    editingId,
    editText,
    editCategoryId,
    setTodos,
    setIsEditing,
    setEditingId,
    setEditText,
    setEditCategoryId,
    onChange,
}) => {
    const colorOptions = getColorOptions({ darkMode });

    // Helper function to get category name by ID
    const getCategoryById = (categoryId?: string) => {
        if (!categoryId) return null;
        return availableCategories.find((cat) => cat.id === categoryId);
    };

    return (
        <div
            className={`flex-1 overflow-y-auto overflow-x-hidden max-h-[310px] mt-0 ${
                darkMode
                    ? 'custom-scroll-thin-dark'
                    : 'custom-scroll-thin-light'
            }`}
        >
            {filteredTodos.map((todo) => {
                const category = getCategoryById(todo.categoryId);
                const categoryColor = category
                    ? colorOptions.find((c) => c.name === category.color)
                    : null;

                return (
                    <div
                        key={todo.id}
                        className={`group flex items-center justify-between p-2 rounded-md ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        } ${
                            filteredTodos.indexOf(todo) !==
                            filteredTodos.length - 1
                                ? 'mb-[2px]'
                                : ''
                        } relative`}
                    >
                        <div className="flex items-center flex-1 min-w-0 w-full">
                            <button
                                onClick={() =>
                                    handleToggleTodo(
                                        todo.id,
                                        todos,
                                        setTodos,
                                        onChange,
                                    )
                                }
                                className={`mr-2 p-1 rounded-full z-20 ${
                                    todo.done
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
                            {isEditing && editingId === todo.id ? (
                                <div className="flex flex-col gap-2 flex-1">
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) =>
                                            setEditText(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === 'Enter' &&
                                            handleSaveEdit(
                                                editingId,
                                                editText,
                                                editCategoryId,
                                                todos,
                                                setTodos,
                                                onChange,
                                                setIsEditing,
                                                setEditingId,
                                                setEditText,
                                                setEditCategoryId,
                                            )
                                        }
                                        onBlur={() =>
                                            handleSaveEdit(
                                                editingId,
                                                editText,
                                                editCategoryId,
                                                todos,
                                                setTodos,
                                                onChange,
                                                setIsEditing,
                                                setEditingId,
                                                setEditText,
                                                setEditCategoryId,
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
                        todo.done
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
                                    {category && categoryColor && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}
                                        >
                                            {category.name}
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
                                            todo.id,
                                            todos,
                                            setIsEditing,
                                            setEditingId,
                                            setEditText,
                                            setEditCategoryId,
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
                                            todo.id,
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
                );
            })}
        </div>
    );
};
