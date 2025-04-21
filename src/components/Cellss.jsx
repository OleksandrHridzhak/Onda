import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ChevronDown, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2 } from 'lucide-react';



const CheckboxCell = ({ checked, onChange }) => {
  return (
    <div className="flex justify-center">
      <label className="relative flex items-center justify-center w-6 h-6 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center 
                        transition-all duration-150 ease-in-out
                        hover:border-gray-500
                        peer-checked:bg-green-400 peer-checked:border-green-500 peer-checked:hover:bg-green-600">
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



  
const TagsCell = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    typeof value === 'string' && value.trim() !== '' ? value.split(', ').filter(tag => tag.trim() !== '') : []
  );
  const dropdownRef = useRef(null);

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
        className="px-0 py-0 rounded-md cursor-pointer flex  items-center justify-between h-full w-full bg-transparent hover:bg-transparent transition-colors"
      >
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-blue-100 text-center text-blue-800 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="h-full w-full min-h-[2rem]"></div>

        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-48 overflow-auto">
          {(options || []).map((option) => (
            <div
              key={option}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm whitespace-nowrap"
              onClick={() => {
                handleTagChange(option);
                setIsOpen(false); // Закриваємо після вибору
              }}
            >
              <span className={selectedTags.includes(option) ? 'text-blue-500' : 'text-gray-700'}>
                {option}
              </span>
            </div>
          ))}
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



  
  export default { CheckboxCell, NumberCell, TagsCell, NotesCell };