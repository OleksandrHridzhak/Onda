import React, { useState, useEffect } from 'react';
import { useRef } from 'react';


export const NotesCell = ({ value, onChange }) => {
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
        {value}
      </div>
    </div>
  );
};