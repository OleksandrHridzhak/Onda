import React from 'react';
import { useNotesEdit } from './hooks/useNotesEdit';
import { startEditing } from './logic';

interface NotesCellProps {
  value: string;
  onChange: (value: string) => void;
}

export const NotesCell: React.FC<NotesCellProps> = ({ value, onChange }) => {
  const {
    isEditing,
    setIsEditing,
    tempValue,
    setTempValue,
    textareaRef,
    handleSave,
    handleKeyDown,
  } = useNotesEdit(value, onChange);

  return isEditing ? (
    <div className="w-full min-w-32 relative font-poppins">
      <textarea
        ref={textareaRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 text-sm bg-transparent font-poppins rounded-md focus:outline-none resize-none text-textTableValues"
        rows={1}
        autoFocus
      />
    </div>
  ) : (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        startEditing(value, setIsEditing, setTempValue);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startEditing(value, setIsEditing, setTempValue);
        }
      }}
      className="w-full min-h-8 px-2 py-1 rounded-md cursor-text text-sm flex items-center group transition-colors text-textTableValues hover:bg-hoverBg active:bg-hoverBg"
      aria-label="Edit note"
      style={{ userSelect: 'none', pointerEvents: 'auto' }}
    >
      <div className="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
        {value || <span className="text-textTableValues opacity-40">Click to edit</span>}
      </div>
    </div>
  );
};
