export const sortTodos = (todos) => {
  return todos.sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });
};

export const handleAddTodo = (
  newTodo,
  newCategory,
  todos,
  setTodos,
  onChange,
  setNewTodo,
  setIsCategoryMenuOpen
) => {
  if (newTodo.trim()) {
    const updatedTodos = [
      ...todos,
      { text: newTodo.trim(), completed: false, category: newCategory || '' },
    ];
    setTodos(updatedTodos);
    onChange(updatedTodos);
    setNewTodo('');
    setIsCategoryMenuOpen(false);
  }
};

export const handleToggleTodo = (index, todos, setTodos, onChange) => {
  const updatedTodos = todos.map((todo, i) =>
    i === index ? { ...todo, completed: !todo.completed } : todo
  );
  const sortedTodos = sortTodos(updatedTodos);
  setTodos(sortedTodos);
  onChange(sortedTodos);
};

export const handleDeleteTodo = (index, todos, setTodos, onChange) => {
  const updatedTodos = todos.filter((_, i) => i !== index);
  const sortedTodos = sortTodos(updatedTodos);
  setTodos(sortedTodos);
  onChange(sortedTodos);
};

export const handleEditTodo = (
  index,
  todos,
  setIsEditing,
  setEditingIndex,
  setEditText,
  setEditCategory
) => {
  setIsEditing(true);
  setEditingIndex(index);
  setEditText(todos[index].text);
  setEditCategory(todos[index].category || '');
};

export const handleSaveEdit = (
  editingIndex,
  editText,
  editCategory,
  todos,
  setTodos,
  onChange,
  setIsEditing,
  setEditingIndex,
  setEditText,
  setEditCategory
) => {
  if (editText.trim()) {
    const updatedTodos = todos.map((todo, i) =>
      i === editingIndex
        ? { ...todo, text: editText.trim(), category: editCategory }
        : todo
    );
    setTodos(updatedTodos);
    onChange(updatedTodos);
    setIsEditing(false);
    setEditingIndex(null);
    setEditText('');
    setEditCategory('');
  }
};

export const filterTodos = (todos, selectedFilterCategory) => {
  return selectedFilterCategory
    ? todos.filter((todo) => todo.category === selectedFilterCategory)
    : todos;
};
