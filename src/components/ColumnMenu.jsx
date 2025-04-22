import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Plus, Trash2, Eye, EyeOff,
    Heart, Star, Zap, Sun, Moon, 
    Coffee, Rocket, Shield, Flag, Bell,
    Book, Music, Pizza, Gamepad,
    ArrowUp, ArrowDown
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
    { component: <Gamepad size={20} />, name: 'Gamepad' }
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
  darkMode 
}) => {
  const [name, setName] = useState(column.Name);
  const [selectedIcon, setSelectedIcon] = useState(column.EmojiIcon || '');
  const [description, setDescription] = useState(column.Description || '');
  const [showTitle, setShowTitle] = useState(column.NameVisible !== false);
  const [tags, setTags] = useState(column.Options || []);
  const [newTag, setNewTag] = useState('');
  const menuRef = useRef(null);

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

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    onRename(column.ColumnId, name);
    onChangeIcon(column.ColumnId, selectedIcon);
    onChangeDescription(column.ColumnId, description);
    onToggleTitleVisibility(column.ColumnId, showTitle);
    if (column.Type === 'multi-select') {
      onChangeOptions(column.ColumnId, tags);
    }
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className={`absolute z-50 top-10 mt-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg w-64`}
    >
      <div className={`px-3 py-2 border-b text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700'} flex justify-between items-center`}>
        <span>Edit Column</span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="mb-3">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Icon</label>
          <div className={`grid grid-cols-5 gap-1 p-1 border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'} rounded-md`}>
            {availableIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => setSelectedIcon(icon.name)}
                className={`p-1 rounded ${selectedIcon === icon.name ? (darkMode ? 'bg-gray-600' : 'bg-gray-200') : ''} ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {icon.component}
              </button>
            ))}
          </div>
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
        {column.Type === 'multi-select' && (
          <div className="mb-3">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Tags</label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="New tag"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button
                onClick={handleAddTag}
                className={`ml-2 p-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className={`max-h-24 overflow-y-auto border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'} rounded-md p-1`}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  className={`flex items-center justify-between px-2 py-1 rounded-full text-sm mb-1 ${
                    darkMode 
                      ? 'bg-blue-900 text-blue-200' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className={`ml-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
        <div className="flex justify-between mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteColumn(column.ColumnId);
            }}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              darkMode
                ? 'text-red-400 hover:text-red-300'
                : 'text-red-600 hover:text-red-700'
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
              darkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
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