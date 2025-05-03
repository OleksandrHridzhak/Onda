import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ChevronDown, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2, ListTodo } from 'lucide-react';



const CheckboxCell = ({ checked, onChange, color = 'green', darkMode }) => {
  const colorOptions = {
    green: {
      bg: darkMode ? 'bg-green-700' : 'bg-green-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-green-600' : 'hover:bg-green-400'
    },
    blue: {
      bg: darkMode ? 'bg-blue-700' : 'bg-blue-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-400'
    },
    purple: {
      bg: darkMode ? 'bg-purple-700' : 'bg-purple-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-purple-600' : 'hover:bg-purple-400'
    },
    orange: {
      bg: darkMode ? 'bg-orange-700' : 'bg-orange-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-orange-600' : 'hover:bg-orange-400'
    }
  };

  const selectedColor = colorOptions[color] || colorOptions.green;

  return (
    <div className="flex justify-center">
      <label className="relative flex items-center justify-center w-6 h-6 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center 
                        transition-all duration-150 ease-in-out
                        ${selectedColor.border}
                        ${checked ? selectedColor.bg : ''}
                        ${checked ? selectedColor.hover : 'hover:border-gray-500'}`}>
          <Check
            size={16}
            className={`absolute text-white transition-opacity duration-150 ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
            strokeWidth={3}
          />
        </div>
      </label>
    </div>
  );
};
    
const NumberCell = ({ value, onChange }) => {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-16 text-center px-1 py-0.5 text-lg bg-transparent border-none 
                 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none
                 [&::-webkit-outer-spin-button]:appearance-none
                 [&::-webkit-inner-spin-button]:appearance-none"
      style={{
        MozAppearance: "textfield", // Для Firefox
      }}
    />
  );
};



  
const TagsCell = ({ value, onChange, options, darkMode, tagColors = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    typeof value === 'string' && value.trim() !== '' ? value.split(', ').filter(tag => tag.trim() !== '') : []
  );
  const dropdownRef = useRef(null);

  const colorOptions = [
    { name: 'blue', bg: darkMode ? 'bg-blue-900' : 'bg-blue-100', text: darkMode ? 'text-blue-100' : 'text-blue-800' },
    { name: 'green', bg: darkMode ? 'bg-green-900' : 'bg-green-100', text: darkMode ? 'text-green-100' : 'text-green-800' },
    { name: 'purple', bg: darkMode ? 'bg-purple-900' : 'bg-purple-100', text: darkMode ? 'text-purple-100' : 'text-purple-800' },
    { name: 'orange', bg: darkMode ? 'bg-orange-900' : 'bg-orange-100', text: darkMode ? 'text-orange-100' : 'text-orange-800' }
  ];

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) => {
      const updatedTags = prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag];
      onChange(updatedTags.join(', '));
      return updatedTags;
    });
  };

  // Закриття при кліку за межі
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-0 py-0 rounded-md cursor-pointer flex items-center justify-between h-full w-full bg-transparent hover:bg-transparent transition-colors"
      >
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => {
              const color = tagColors[tag] || 'blue';
              const colorOption = colorOptions.find(opt => opt.name === color);
              return (
                <span 
                  key={tag} 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${colorOption.bg} ${colorOption.text}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="h-full w-full min-h-[2rem]"></div>
        )}
      </div>
      
      {isOpen && (
        <div className={`absolute z-10 mt-1 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg max-h-48 overflow-auto`}>
          {(options || []).map((option) => {
            const color = tagColors[option] || 'blue';
            const colorOption = colorOptions.find(opt => opt.name === color);
            return (
              <div
                key={option}
                className={`px-3 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} cursor-pointer text-sm whitespace-nowrap`}
                onClick={() => {
                  handleTagChange(option);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorOption.bg} ${colorOption.text} mr-2`}>
                    {option}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
  
  const NotesCell = ({ value, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const textareaRef = useRef(null);
  
    const handleSave = () => {
      onChange(tempValue);
      setIsEditing(false);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    };
  
    useEffect(() => {
      if (isEditing && textareaRef.current) {
        // Автоматичний розмір текстареа
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [isEditing, tempValue]);
  
    return isEditing ? (
      <div className="w-full min-w-32 relative">
        <textarea
          ref={textareaRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 text-sm bg-transparent rounded-md focus:outline-none resize-none"
          rows={1}
          autoFocus
        />
      </div>
    ) : (
      <div
        onClick={() => {
          setIsEditing(true);
          setTempValue(value);
        }}
        className="w-full min-h-8 px-2 py-1 rounded-md cursor-text text-sm flex items-center group transition-colors"
      >
        <div className="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {value }
        </div>
      </div>
    );
  };
  
  const TodoCell = ({ value, onChange, darkMode }) => {
    const [todos, setTodos] = useState(value || []);
    const [newTodo, setNewTodo] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
  
    useEffect(() => {
      const sortedTodos = [...(value || [])].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
      setTodos(sortedTodos);
    }, [value]);
  
    const handleAddTodo = () => {
      if (newTodo.trim()) {
        const updatedTodos = [...todos, { text: newTodo.trim(), completed: false }];
        setTodos(updatedTodos);
        onChange(updatedTodos);
        setNewTodo('');
      }
    };
  
    const handleToggleTodo = (index) => {
      const updatedTodos = todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      );
      const sortedTodos = updatedTodos.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
      setTodos(sortedTodos);
      onChange(sortedTodos);
    };
  
    const handleDeleteTodo = (index) => {
      const updatedTodos = todos.filter((_, i) => i !== index);
      const sortedTodos = updatedTodos.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
      setTodos(sortedTodos);
      onChange(sortedTodos);
    };
  
    const handleEditTodo = (index) => {
      setIsEditing(true);
      setEditingIndex(index);
      setEditText(todos[index].text);
    };
  
    const handleSaveEdit = () => {
      if (editText.trim()) {
        const updatedTodos = todos.map((todo, i) =>
          i === editingIndex ? { ...todo, text: editText.trim() } : todo
        );
        setTodos(updatedTodos);
        onChange(updatedTodos);
        setIsEditing(false);
        setEditingIndex(null);
        setEditText('');
      }
    };
  
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add new todo..."
            className={`w-full px-3 py-2 text-sm rounded-md transition-all duration-200
              ${darkMode 
                ? 'bg-gray-700 text-gray-200 placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                : 'bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              } border outline-none`}
          />
          <button
            onClick={handleAddTodo}
            className={`ml-2 p-2 rounded-md transition-colors duration-200 ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto overflow-x-hidden max-h-[330px] mt-0
          [&::-webkit-scrollbar]:w-1/2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:transition-colors
          [&::-webkit-scrollbar-thumb]:duration-200
          ${darkMode 
            ? '[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:hover:bg-gray-500'
            : '[&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:hover:bg-gray-300'
          }`}>
          {todos.map((todo, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between p-2 rounded-md ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } ${index !== todos.length - 1 ? 'mb-[2px]' : ''} relative`}
            >
              <div className="flex items-center flex-1 min-w-0 w-full">
                <button
                  onClick={() => handleToggleTodo(index)}
                  className={`mr-2 p-1 rounded-full z-20 ${
                    todo.completed
                      ? darkMode
                        ? 'bg-green-600 text-white'
                        : 'bg-green-500 text-white'
                      : darkMode
                        ? 'bg-gray-600 text-gray-400'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Check size={14} />
                </button>
                {isEditing && editingIndex === index ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    onBlur={handleSaveEdit}
                    className={`flex-1 px-2 py-1 text-sm rounded-md z-20 ${
                      darkMode
                        ? 'bg-gray-600 text-gray-200 border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    } border outline-none focus:outline-none min-w-0`}
                    autoFocus
                  />
                ) : (
                  <div
                    className={`
                      flex-1 min-w-0 w-full
                      text-sm
                      ${todo.completed
                        ? darkMode
                          ? 'text-gray-500 line-through'
                          : 'text-gray-400 line-through'
                        : darkMode
                          ? 'text-gray-200'
                          : 'text-gray-700'
                      }
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
                )}
              </div>
              <div
                className="flex space-x-1 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-full justify-center z-10"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditTodo(index);
                  }}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    darkMode
                      ? 'bg-gray-800 text-gray-400 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteTodo(index);
                  }}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    darkMode
                      ? 'bg-gray-800 text-red-400 hover:text-red-300'
                      : 'bg-gray-100 text-red-500 hover:text-red-700'
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div
                className={`absolute z-50 left-0 bottom-full mb-2 px-2 py-1 text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${
                  darkMode
                    ? 'bg-gray-800 text-gray-200 border-gray-700'
                    : 'bg-gray-800 text-white'
                } ${todo.text ? '' : 'hidden'} pointer-events-none`}
              >
                {todo.text}
                <div
                  className={`absolute left-2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 ${
                    darkMode ? 'border-t-gray-800' : 'border-t-gray-800'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default { CheckboxCell, NumberCell, TagsCell, NotesCell, TodoCell };