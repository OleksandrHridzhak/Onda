import { useState, useEffect } from 'react';

interface Todo {
  text: string;
  completed: boolean;
  category?: string;
}

interface TodoState {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editText: string;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  editCategory: string;
  setEditCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedFilterCategory: string;
  setSelectedFilterCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const useTodoState = (value: Todo[]): TodoState => {
  const [todos, setTodos] = useState<Todo[]>(value || []);
  const [newTodo, setNewTodo] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
