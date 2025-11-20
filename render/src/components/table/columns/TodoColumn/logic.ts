interface Todo {
  text: string;
  completed: boolean;
  category?: string;
}

export const sortTodos = (todos: Todo[]): Todo[] => {
  return todos.sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });
};

export const handleAddTodo = (
  newTodo: string,
  newCategory: string,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onChange: (todos: Todo[]) => void,
  setNewTodo: React.Dispatch<React.SetStateAction<string>>,
): void => {
  if (newTodo.trim()) {
    const updatedTodos = [
      ...todos,
      { text: newTodo.trim(), completed: false, category: newCategory || '' },
    ];
    setTodos(updatedTodos);
    onChange(updatedTodos);
    setNewTodo('');
  }
};

export const handleToggleTodo = (
  index: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onChange: (todos: Todo[]) => void,
): void => {
  const updatedTodos = todos.map((todo, i) =>
    i === index ? { ...todo, completed: !todo.completed } : todo,
  );
  const sortedTodos = sortTodos(updatedTodos);
  setTodos(sortedTodos);
  onChange(sortedTodos);
};

export const handleDeleteTodo = (
  index: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onChange: (todos: Todo[]) => void,
): void => {
  const updatedTodos = todos.filter((_, i) => i !== index);
  const sortedTodos = sortTodos(updatedTodos);
  setTodos(sortedTodos);
  onChange(sortedTodos);
};

export const handleEditTodo = (
  index: number,
  todos: Todo[],
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditText: React.Dispatch<React.SetStateAction<string>>,
  setEditCategory: React.Dispatch<React.SetStateAction<string>>,
): void => {
  setIsEditing(true);
  setEditingIndex(index);
  setEditText(todos[index].text);
  setEditCategory(todos[index].category || '');
};

export const handleSaveEdit = (
  editingIndex: number | null,
  editText: string,
  editCategory: string,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onChange: (todos: Todo[]) => void,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditText: React.Dispatch<React.SetStateAction<string>>,
  setEditCategory: React.Dispatch<React.SetStateAction<string>>,
): void => {
  if (editText.trim() && editingIndex !== null) {
    const updatedTodos = todos.map((todo, i) =>
      i === editingIndex
        ? { ...todo, text: editText.trim(), category: editCategory }
        : todo,
    );
    setTodos(updatedTodos);
    onChange(updatedTodos);
    setIsEditing(false);
    setEditingIndex(null);
    setEditText('');
    setEditCategory('');
  }
};

export const filterTodos = (
  todos: Todo[],
  selectedFilterCategory: string,
): Todo[] => {
  return selectedFilterCategory
    ? todos.filter((todo) => todo.category === selectedFilterCategory)
    : todos;
};
