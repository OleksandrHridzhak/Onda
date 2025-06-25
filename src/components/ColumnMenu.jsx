import React, { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Trash2, Eye, EyeOff,
  Heart, Star, Zap, Sun, Moon,
  Coffee, Rocket, Shield, Flag, Bell,
  Book, Music, Pizza, Gamepad,
  Camera, Clock, Globe, Lock, Map,
  Mic, Pen, Phone, Search, User, BicepsFlexed, ChevronDown, ChevronUp, ArrowUp, ArrowDown, ListTodo
} from 'lucide-react';

const availableIcons = [
  { component: <Heart size={20} />, name: 'Heart' },
  { component: <Star size={20} />, name: 'Star' },
  { component: <Zap size={20} />, name: 'Zap' },
  { component: <Sun size={20} />, name: 'Sun' },
  { component: <Moon size={20} />, name: 'Moon' },
  { component: <Coffee size={20} />, name: 'Coffee' },
  { component: <Rocket size={20} />, name: 'Rocket' },
  { component: <Shield size={20} />, name: 'Shield' },
  { component: <Flag size={20} />, name: 'Flag' },
  { component: <Bell size={20} />, name: 'Bell' },
  { component: <Book size={20} />, name: 'Book' },
  { component: <Music size={20} />, name: 'Music' },
  { component: <Pizza size={20} />, name: 'Pizza' },
  { component: <Gamepad size={20} />, name: 'Gamepad' },
  { component: <Camera size={20} />, name: 'Camera' },
  { component: <Clock size={20} />, name: 'Clock' },
  { component: <Globe size={20} />, name: 'Globe' },
  { component: <Lock size={20} />, name: 'Lock' },
  { component: <Map size={20} />, name: 'Map' },
  { component: <Mic size={20} />, name: 'Mic' },
  { component: <Pen size={20} />, name: 'Pen' },
  { component: <Phone size={20} />, name: 'Phone' },
  { component: <Search size={20} />, name: 'Search' },
  { component: <User size={20} />, name: 'User' },
  { component: <BicepsFlexed size={20} />, name: 'BicepsFlexed' }
];

const ColumnMenu = ({
  column,
  handleDeleteColumn,
  onClose,
  onRename,
  onChangeIcon,
  onChangeDescription,
  onToggleTitleVisibility,
  onChangeOptions,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  darkMode,
  onChangeWidth,
  onChangeCheckboxColor = () => {}
}) => {
  const [name, setName] = useState(column.Name);
  const [selectedIcon, setSelectedIcon] = useState(column.EmojiIcon || '');
  const [description, setDescription] = useState(column.Description || '');
  const [showTitle, setShowTitle] = useState(column.NameVisible !== false);
  const [options, setOptions] = useState(column.Options || []);
  const [doneTags, setDoneTags] = useState(column.DoneTags || []);
  const [optionColors, setOptionColors] = useState(column.TagColors || {});
  const [checkboxColor, setCheckboxColor] = useState(column.CheckboxColor || 'green');
  const [newTask, setNewTask] = useState('');
  const [width, setWidth] = useState(column.Width ? parseInt(column.Width) : '');
  const [isIconSectionExpanded, setIsIconSectionExpanded] = useState(false);
  const menuRef = useRef(null);

  const colorOptions = [
    { name: 'green', bg: darkMode ? 'bg-green-900' : 'bg-green-100', text: darkMode ? 'text-green-100' : 'text-green-800' },
    { name: 'blue', bg: darkMode ? 'bg-blue-900' : 'bg-blue-100', text: darkMode ? 'text-blue-100' : 'text-blue-800' },
    { name: 'purple', bg: darkMode ? 'bg-purple-900' : 'bg-purple-100', text: darkMode ? 'text-purple-100' : 'text-purple-800' },
    { name: 'orange', bg: darkMode ? 'bg-orange-900' : 'bg-orange-100', text: darkMode ? 'text-orange-100' : 'text-orange-800' }
  ];

  useEffect(() => {
    setName(column.Name);
    setSelectedIcon(column.EmojiIcon || '');
    setDescription(column.Description || '');
    setShowTitle(column.NameVisible !== false);
    setOptions(column.Options || []);
    setDoneTags(column.DoneTags || []);
    setOptionColors(column.TagColors || {});
    setCheckboxColor(column.CheckboxColor || 'green');
    setWidth(column.Width ? parseInt(column.Width) : '');
  }, [column]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAddTask = () => {
    if (newTask.trim() && !options.includes(newTask.trim()) && !doneTags.includes(newTask.trim())) {
      const newOptions = [...options, newTask.trim()];
      setOptions(newOptions);
      setOptionColors(prev => ({ ...prev, [newTask.trim()]: 'blue' }));
      setNewTask('');
      onChangeOptions(column.ColumnId, newOptions, optionColors, doneTags);
    }
  };

  const handleRemoveOption = (option) => {
    const isInOptions = options.includes(option);
    const isInDoneTags = doneTags.includes(option);

    if (isInOptions) {
      const newOptions = options.filter((opt) => opt !== option);
      setOptions(newOptions);
      const newColors = { ...optionColors };
      delete newColors[option];
      setOptionColors(newColors);
      onChangeOptions(column.ColumnId, newOptions, newColors, doneTags);
    } else if (isInDoneTags) {
      const newDoneTags = doneTags.filter((tag) => tag !== option);
      setDoneTags(newDoneTags);
      const newColors = { ...optionColors };
      delete newColors[option];
      setOptionColors(newColors);
      onChangeOptions(column.ColumnId, options, newColors, newDoneTags);
    }
  };

  const handleColorChange = (option, color) => {
    setOptionColors(prev => {
      const newColors = { ...prev, [option]: color };
      onChangeOptions(column.ColumnId, options, newColors, doneTags);
      return newColors;
    });
  };

  const handleSave = () => {
    onRename(column.ColumnId, name);
    onChangeIcon(column.ColumnId, selectedIcon);
    onChangeDescription(column.ColumnId, description);
    onToggleTitleVisibility(column.ColumnId, showTitle);
    if (['multi-select', 'todo', 'multicheckbox', 'tasktable'].includes(column.Type)) {
      onChangeOptions(column.ColumnId, options, optionColors, doneTags);
    }
    if (column.Type === 'checkbox') {
      onChangeCheckboxColor(column.ColumnId, checkboxColor);
    }
    if (onChangeWidth && width !== column.Width) {
      onChangeWidth(column.ColumnId, width);
    }
    onClose();
  };

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (onChangeWidth) {
      onChangeWidth(column.ColumnId, newWidth);
    }
  };

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 top-10 left-40 translate-x-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg w-80`}
      style={{
        position: 'absolute',
        top: '-1px',
        right: '-1px',
        transform: 'translateX(100%)',
      }}
    >
      <div className={`sticky top-0 px-3 py-2 border-b text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700 bg-gray-800' : 'text-gray-700 border-gray-200 bg-white'} flex justify-between items-center`}>
        <span>Edit Column</span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="mb-3">
          <button
            onClick={() => setIsIconSectionExpanded(!isIconSectionExpanded)}
            className={`w-full flex items-center justify-between px-2 py-1 rounded-md ${
              darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              {selectedIcon && availableIcons.find(i => i.name === selectedIcon)?.component}
              <span className="text-sm font-medium">
                {isIconSectionExpanded ? 'Hide Icons' : 'Choose Icon'}
              </span>
            </div>
            {isIconSectionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isIconSectionExpanded && (
            <div
              className={`mt-2 grid grid-cols-5 gap-1 p-1 border ${
                darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
              } rounded-md`}
            >
              {availableIcons.map((icon) => (
                <button
                  key={icon.name}
                  onClick={() => {
                    setSelectedIcon(icon.name);
                    setIsIconSectionExpanded(false);
                  }}
                  className={`flex items-center justify-center p-2 rounded ${
                    selectedIcon === icon.name
                      ? darkMode
                        ? 'bg-gray-600'
                        : 'bg-gray-200'
                      : ''
                  } ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    {icon.component}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Column Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
          />
        </div>
        <div className="mb-3">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Description (shown on hover)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
            rows="2"
          />
        </div>
        <div className="mb-3">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Column Position</label>
          <div className="flex space-x-2">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className={`flex-1 px-3 py-2 border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-md flex items-center justify-center space-x-1 ${
                canMoveUp
                  ? darkMode
                    ? 'text-gray-200 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  : darkMode
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp size={16} />
              <span>Move Up</span>
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className={`flex-1 px-3 py-2 border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-md flex items-center justify-center space-x-1 ${
                canMoveDown
                  ? darkMode
                    ? 'text-gray-200 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  : darkMode
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowDown size={16} />
              <span>Move Down</span>
            </button>
          </div>
        </div>
        {column.Type === 'tasktable' && (
          <div className="mb-3">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Add New Task</label>
            <div className="flex items-center relative">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Add new task..."
                className={`flex-1 px-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm pr-10`}
              />
              <button
                onClick={handleAddTask}
                className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
        {['multi-select', 'todo', 'multicheckbox', 'tasktable'].includes(column.Type) && (
          <div className="mb-3">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              {column.Type === 'tasktable' ? 'Tasks' : column.Type === 'multi-select' ? 'Tags' : column.Type === 'todo' ? 'Categories' : 'Checkboxes'}
            </label>
            <div className="space-y-2">
              {[...options, ...doneTags].map((option) => (
                <div key={option} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorOptions.find(c => c.name === optionColors[option])?.bg} ${colorOptions.find(c => c.name === optionColors[option])?.text}`}>
                      {option} {doneTags.includes(option) && '(Completed)'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex gap-1">
                      {colorOptions.map(color => (
                        <button
                          key={color.name}
                          onClick={() => handleColorChange(option, color.name)}
                          className={`w-4 h-4 rounded-full ${color.bg} ${color.text} border ${optionColors[option] === color.name ? 'border-white' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handleRemoveOption(option)}
                      className={`p-1 rounded-md ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-100'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center mb-3">
          <button
            onClick={() => setShowTitle(!showTitle)}
            className={`flex items-center space-x-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            {showTitle ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="text-sm">Show Column Title</span>
          </button>
        </div>
        <div className="mb-3">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Column Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
            min="50"
            max="1000"
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
            placeholder="Enter width in pixels"
          />
        </div>
        {column.Type === 'checkbox' && (
          <div className="mb-3">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Checkbox Color</label>
            <div className="flex gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.name}
                  onClick={() => setCheckboxColor(color.name)}
                  className={`w-6 h-6 rounded-full ${color.bg} ${color.text} border ${
                    checkboxColor === color.name ? 'border-white' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteColumn(column.ColumnId);
            }}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
            }`}
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnMenu;