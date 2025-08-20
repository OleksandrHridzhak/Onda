import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { getColorOptions } from '../../utils/colorOptions';

export const TagsCell = ({ value, onChange, options, darkMode, tagColors = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    typeof value === 'string' && value.trim() !== '' ? value.split(', ').filter(tag => tag.trim() !== '') : []
  );
  const dropdownRef = useRef(null);


  const colorOptions = getColorOptions({darkMode});

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) => {
      const updatedTags = prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag];
      onChange(updatedTags.join(', '));
      return updatedTags;
    });
  };

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