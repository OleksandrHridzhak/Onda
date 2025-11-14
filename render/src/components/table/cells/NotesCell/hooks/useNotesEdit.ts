import { useState, useEffect, useRef } from 'react';

interface NotesEditState {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  tempValue: string;
  setTempValue: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  handleSave: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const useNotesEdit = (value: string, onChange: (value: string) => void): NotesEditState => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = (): void => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
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
