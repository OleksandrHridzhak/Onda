import { useState, useEffect, useRef } from 'react';

export const useNotesEdit = (value, onChange) => {
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

  return {
    isEditing,
    setIsEditing,
    tempValue,
    setTempValue,
    textareaRef,
    handleSave,
    handleKeyDown,
  };
};
