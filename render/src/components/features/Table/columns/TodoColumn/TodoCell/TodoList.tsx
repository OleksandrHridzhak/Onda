import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { COLOR_STYLES } from '../../../../../../utils/colorOptions';
import {
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    handleSaveEdit,
} from './logic';
import { Todo, Tag } from '../../../../../../types/newColumn.types';
import { TodoEditModal } from './TodoEditModal';

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
    // Helper function to get category name by ID
    const getCategoryById = (categoryId?: string) => {
        if (!categoryId) return null;
        return availableCategories.find((cat) => cat.id === categoryId);
    };

    const handleCloseEditModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setEditText('');
        setEditCategoryId('');
    };

    const handleSaveEditModal = () => {
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
        );
    };

    return (
        <>
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
                        ? COLOR_STYLES[category.color]
                        : null;

                    return (
                        <div
                            key={todo.id}
                            className={`group flex items-center justify-between rounded-lg border border-border bg-surface px-2 py-2 mt-1 ${
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
                                            ? 'bg-primaryColor text-white'
                                            : 'bg-secondary text-textSubtle'
                                    }`}
                                >
                                    <Check size={14} />
                                </button>
                                <div className="flex items-center flex-1 min-w-0 w-full gap-2">
                                    <div
                                        className={`
                    flex-1 min-w-0 w-full
                    text-sm
                    ${todo.done ? 'text-textSubtle line-through' : 'text-text'}
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
                            </div>
                            {!isEditing && (
                                <div className="absolute top-1/2 z-10 flex w-full -translate-y-1/2 justify-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
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
                                        className="flex items-center justify-center rounded-md bg-surface p-2 text-textMuted hover:text-text"
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
                                        className="flex items-center justify-center rounded-md bg-surface p-2 text-danger hover:bg-danger hover:text-white"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <TodoEditModal
                isOpen={isEditing && editingId !== null}
                editText={editText}
                editCategoryId={editCategoryId}
                availableCategories={availableCategories}
                setEditText={setEditText}
                setEditCategoryId={setEditCategoryId}
                onClose={handleCloseEditModal}
                onSave={handleSaveEditModal}
            />
        </>
    );
};
