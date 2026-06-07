import React from 'react';
import { Check } from 'lucide-react';
import { handleAddTodo } from 'features/Table/columns/TodoColumn/TodoCell/logic';
import { Todo } from 'app/types/newColumn.types';
import { Button } from 'shared/ui/Button';
import { Input } from 'shared/ui/Input';

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
            <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && onAddTodo()}
                placeholder="Add new todo..."
                inputSize="sm"
                className="pr-10 bg-surface"
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
