import { useState, useEffect } from 'react';
import { Todo } from '../../../../../../../types/newColumn.types';

interface TodoState {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    newTodo: string;
    setNewTodo: React.Dispatch<React.SetStateAction<string>>;
    newCategoryId: string;
    setNewCategoryId: React.Dispatch<React.SetStateAction<string>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    editingId: string | null;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
    editText: string;
    setEditText: React.Dispatch<React.SetStateAction<string>>;
    editCategoryId: string;
    setEditCategoryId: React.Dispatch<React.SetStateAction<string>>;
    selectedFilterCategoryId: string;
    setSelectedFilterCategoryId: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Custom hook for managing todo state
 * Handles local state for todos with automatic sorting by completion status
 */
export const useTodoState = (value: Todo[]): TodoState => {
    const [todos, setTodos] = useState<Todo[]>(value || []);
    const [newTodo, setNewTodo] = useState('');
    const [newCategoryId, setNewCategoryId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [editCategoryId, setEditCategoryId] = useState('');
    const [selectedFilterCategoryId, setSelectedFilterCategoryId] =
        useState('');

    useEffect(() => {
        const sortedTodos = [...(value || [])].sort((a, b) => {
            if (a.done === b.done) return 0;
            return a.done ? 1 : -1;
        });
        setTodos(sortedTodos);
    }, [value]);

    return {
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
    };
};
