import React from 'react';
import { Check } from 'lucide-react';
import { handleAddTodo } from './logic';
import { Todo } from '../../../../../../types/newColumn.types';
import { Button } from '../../../../../shared/Button';

interface TodoInputProps {
    newTodo: string;
    setNewTodo: (value: string) => void;
    newCategoryId: string;
    todos: Todo[];
    setTodos: (todos: Todo[]) => void;
    onChange: (value: Todo[]) => void;
}

/**
 * TodoInput component
 * Provides input field and button for adding new todos
 */
export const TodoInput: React.FC<TodoInputProps> = ({
    newTodo,
    setNewTodo,
    newCategoryId,
    todos,
    setTodos,
    onChange,
}) => {
    const onAddTodo = () =>
        handleAddTodo(
            newTodo,
            newCategoryId,
            todos,
            setTodos,
            onChange,
            setNewTodo,
        );

    return (
        <div className="flex items-center relative">
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && onAddTodo()}
                placeholder="Add new todo..."
                className="w-full px-3 py-2 pr-10 text-sm rounded-md bg-surface text-text placeholder-textSubtle border border-border outline-none focus:border-primaryColor focus:ring-1 focus:ring-primaryColor"
            />
            <Button
                onClick={onAddTodo}
                className="absolute right-1 top-1/2 -translate-y-1/2 !p-2 min-w-0 rounded-md"
            >
                <Check size={16} />
            </Button>
        </div>
    );
};
