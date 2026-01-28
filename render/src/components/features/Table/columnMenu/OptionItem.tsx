import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getColorOptions } from '../../../../utils/colorOptions';
import { Tag } from '../../../../types/newColumn.types';

interface OptionItemProps {
  tag: Tag;
  allTags: Tag[];
  doneTags: string[];
  darkMode: boolean;
  handleColorChange: (tagId: string, color: string) => void;
  handleRemoveOption: (tagId: string) => void;
  handleEditOption: (tagId: string, newName: string) => void;
}

export const OptionItem: React.FC<OptionItemProps> = ({
  tag,
  allTags,
  doneTags,
  darkMode,
  handleColorChange,
  handleRemoveOption,
  handleEditOption,
}) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const startEditing = (): void => {
    setEditingTagId(tag.id);
    setEditValue(tag.name);
  };

  const saveEdit = (): void => {
    if (editValue.trim()) {
      handleEditOption(tag.id, editValue.trim());
    }
    setEditingTagId(null);
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
    <div key={tag.id} className="relative">
      {editingTagId === tag.id ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
            className={`px-2 py-1 rounded-full text-xs font-medium border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primaryColor`}
            aria-label={`Edit ${tag.name}`}
          />
          <button
            onClick={saveEdit}
            className={`ml-2 p-1 rounded-lg text-primaryColor hover:bg-hoverBg transition-colors duration-200`}
            aria-label={`Save edit for ${tag.name}`}
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getColorOptions({ darkMode }).find((c) => c.name === tag.color)?.bg} ${getColorOptions({ darkMode }).find((c) => c.name === tag.color)?.text || 'text-text'}`}
            aria-label={`Options for ${tag.name}`}
          >
            {tag.name} {doneTags.includes(tag.id) && '(Completed)'}
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
                      handleColorChange(tag.id, color.name);
                      setIsContextMenuOpen(false);
                    }}
                    className={`w-6 h-6 rounded-full ${color.bg} ${color.text || 'text-text'} border-2 ${tag.color === color.name ? 'ring-2 ring-primaryColor ring-offset-2' : 'border-transparent'} hover:scale-110 hover:shadow-md transition-all duration-200`}
                    aria-label={`Select ${color.name} color for ${tag.name}`}
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
                  aria-label={`Edit ${tag.name}`}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    handleRemoveOption(tag.id);
                    setIsContextMenuOpen(false);
                  }}
                  className={`p-1 rounded-lg text-red-500 hover:bg-hoverBg transition-colors duration-200`}
                  aria-label={`Remove ${tag.name}`}
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
