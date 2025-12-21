import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getColorOptions } from '../../../../utils/colorOptions';

interface OptionItemProps {
  option: string;
  options: string[];
  doneTags: string[];
  optionColors: Record<string, string>;
  darkMode: boolean;
  handleColorChange: (option: string, color: string) => void;
  handleRemoveOption: (option: string) => void;
  handleEditOption: (oldOption: string, newOption: string) => void;
}

export const OptionItem: React.FC<OptionItemProps> = ({
  option,
  options,
  doneTags,
  optionColors,
  darkMode,
  handleColorChange,
  handleRemoveOption,
  handleEditOption,
}) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const startEditing = (): void => {
    setEditingOption(option);
    setEditValue(option);
  };

  const saveEdit = (): void => {
    if (
      editValue.trim() &&
      !options.includes(editValue.trim()) &&
      !doneTags.includes(editValue.trim())
    ) {
      handleEditOption(option, editValue.trim());
    }
    setEditingOption(null);
    setEditValue('');
    setIsContextMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsContextMenuOpen(false);
      }
    };

    if (isContextMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContextMenuOpen]);

  return (
    <div key={option} className="relative">
      {editingOption === option ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
            className={`px-2 py-1 rounded-full text-xs font-medium border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primaryColor`}
            aria-label={`Edit ${option}`}
          />
          <button
            onClick={saveEdit}
            className={`ml-2 p-1 rounded-lg text-primaryColor hover:bg-hoverBg transition-colors duration-200`}
            aria-label={`Save edit for ${option}`}
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getColorOptions({ darkMode }).find((c) => c.name === optionColors[option])?.bg} ${getColorOptions({ darkMode }).find((c) => c.name === optionColors[option])?.text || 'text-text'}`}
            aria-label={`Options for ${option}`}
          >
            {option} {doneTags.includes(option) && '(Completed)'}
          </button>
          {isContextMenuOpen && (
            <div
              ref={menuRef}
              className={`absolute left-0 top-full mt-1 bg-background border-border border rounded-lg shadow-lg p-2 z-10`}
            >
              <div className="flex items-center space-x-2 p-2 overflow-x-auto max-w-xs">
                {getColorOptions({ darkMode }).map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      handleColorChange(option, color.name);
                      setIsContextMenuOpen(false);
                    }}
                    className={`w-6 h-6 rounded-full ${color.bg} ${color.text || 'text-text'} border-2 ${optionColors[option] === color.name ? 'ring-2 ring-primaryColor ring-offset-2' : 'border-transparent'} hover:scale-110 hover:shadow-md transition-all duration-200`}
                    aria-label={`Select ${color.name} color for ${option}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => {
                    startEditing();
                    setIsContextMenuOpen(false);
                  }}
                  className={`p-1 rounded-lg text-primaryColor hover:bg-hoverBg transition-colors duration-200`}
                  aria-label={`Edit ${option}`}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    handleRemoveOption(option);
                    setIsContextMenuOpen(false);
                  }}
                  className={`p-1 rounded-lg text-red-500 hover:bg-hoverBg transition-colors duration-200`}
                  aria-label={`Remove ${option}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
