import React from 'react';
import { Check } from 'lucide-react';
import { handleAddTodo } from './logic';
import { Todo } from '../../../../../../types/newColumn.types';

interface TodoInputProps {
    newTodo: string;
    setNewTodo: (value: string) => void;
    newCategoryId: string;
    todos: Todo[];
    setTodos: (todos: Todo[]) => void;
    onChange: (value: Todo[]) => void;
    darkMode: boolean;
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
    darkMode,
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
                className={`w-full px-3 py-2 pr-10 text-sm rounded-md transition-all duration-200
          ${
              darkMode
                  ? 'bg-gray-700 text-gray-200 placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          } border outline-none`}
            />
            <button
                onClick={onAddTodo}
                className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md transition-colors duration-200 ${
                    darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
                <Check size={16} />
            </button>
        </div>
    );
};
