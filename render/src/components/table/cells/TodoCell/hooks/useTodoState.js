import { useState, useEffect } from 'react';

export const useTodoState = (value) => {
  const [todos, setTodos] = useState(value || []);
  const [newTodo, setNewTodo] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('');

  useEffect(() => {
    const sortedTodos = [...(value || [])].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
    setTodos(sortedTodos);
  }, [value]);

  return {
    todos,
    setTodos,
    newTodo,
    setNewTodo,
    newCategory,
    setNewCategory,
    isEditing,
    setIsEditing,
    editingIndex,
    setEditingIndex,
    editText,
    setEditText,
    editCategory,
    setEditCategory,
    selectedFilterCategory,
    setSelectedFilterCategory,
  };
};
