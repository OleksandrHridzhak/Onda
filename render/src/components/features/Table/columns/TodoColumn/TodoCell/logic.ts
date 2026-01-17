import { Todo } from '../../../../../../types/newColumn.types';

/**
 * Sort todos by completion status (incomplete first, completed last)
 */
export const sortTodos = (todos: Todo[]): Todo[] => {
    return todos.sort((a, b) => {
        if (a.done === b.done) return 0;
        return a.done ? 1 : -1;
    });
};

/**
 * Add a new todo to the list
 */
export const handleAddTodo = (
    newTodo: string,
    newCategoryId: string,
    todos: Todo[],
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
    onChange: (todos: Todo[]) => void,
    setNewTodo: React.Dispatch<React.SetStateAction<string>>,
): void => {
    if (newTodo.trim()) {
        const updatedTodos = [
            ...todos,
            {
                id: crypto.randomUUID(),
                text: newTodo.trim(),
                done: false,
                categoryId: newCategoryId || undefined,
            },
        ];
        setTodos(updatedTodos);
        onChange(updatedTodos);
        setNewTodo('');
    }
};

/**
 * Toggle todo completion status
 */
export const handleToggleTodo = (
    id: string,
    todos: Todo[],
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
    onChange: (todos: Todo[]) => void,
): void => {
    const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
    );
    const sortedTodos = sortTodos(updatedTodos);
    setTodos(sortedTodos);
    onChange(sortedTodos);
};

/**
 * Delete a todo from the list
 */
export const handleDeleteTodo = (
    id: string,
    todos: Todo[],
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
    onChange: (todos: Todo[]) => void,
): void => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    const sortedTodos = sortTodos(updatedTodos);
    setTodos(sortedTodos);
    onChange(sortedTodos);
};

/**
 * Start editing a todo
 */
export const handleEditTodo = (
    id: string,
    todos: Todo[],
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>,
    setEditText: React.Dispatch<React.SetStateAction<string>>,
    setEditCategoryId: React.Dispatch<React.SetStateAction<string>>,
): void => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
        setIsEditing(true);
        setEditingId(id);
        setEditText(todo.text);
        setEditCategoryId(todo.categoryId || '');
    }
};

/**
 * Save edited todo
 */
export const handleSaveEdit = (
    editingId: string | null,
    editText: string,
    editCategoryId: string,
    todos: Todo[],
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
    onChange: (todos: Todo[]) => void,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>,
    setEditText: React.Dispatch<React.SetStateAction<string>>,
    setEditCategoryId: React.Dispatch<React.SetStateAction<string>>,
): void => {
    if (editText.trim() && editingId !== null) {
        const updatedTodos = todos.map((todo) =>
            todo.id === editingId
                ? {
                      ...todo,
                      text: editText.trim(),
                      categoryId: editCategoryId || undefined,
                  }
                : todo,
        );
        setTodos(updatedTodos);
        onChange(updatedTodos);
        setIsEditing(false);
        setEditingId(null);
        setEditText('');
        setEditCategoryId('');
    }
};

/**
 * Filter todos by category
 */
export const filterTodos = (
    todos: Todo[],
    selectedFilterCategoryId: string,
): Todo[] => {
    return selectedFilterCategoryId
        ? todos.filter((todo) => todo.categoryId === selectedFilterCategoryId)
        : todos;
};
