import React from 'react';
import { Plus } from 'lucide-react';
import { OptionItem } from './OptionItem';
import { Tag } from '../../../../types/newColumn.types';

interface OptionsListProps {
  columnType: string;
  tags: Tag[];
  doneTags: string[];
  newOption: string;
  setNewOption: (value: string) => void;
  handleAddOption: () => void;
  handleRemoveOption: (tagId: string) => void;
  handleEditOption: (tagId: string, newName: string) => void;
  handleColorChange: (tagId: string, color: string) => void;
  darkMode: boolean;
  isColorMenuOpen?: Record<string, boolean>;
  toggleColorMenu: (tagId: string) => void;
}

export const OptionsList: React.FC<OptionsListProps> = ({
  columnType,
  tags,
  doneTags,
  newOption,
  setNewOption,
  handleAddOption,
  handleRemoveOption,
  handleEditOption,
  handleColorChange,
  darkMode,
  toggleColorMenu,
}) => {
  const getLabelText = () => {
    if (columnType === 'tasktable') return 'Tasks';
    if (columnType === 'multiselect') return 'Tags';
    if (columnType === 'todo') return 'Categories';
    return 'Checkboxes';
  };

  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium text-textTableValues mb-1`}>
        {getLabelText()}
      </label>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
            placeholder={`Add new ${columnType === 'multicheckbox' ? 'checkbox' : 'option'}...`}
            className={`flex-1 px-4 py-2 h-12 border border-border bg-background text-text placeholder-textTableValues rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200`}
            aria-label={`Add new ${columnType}`}
          />
          <button
            onClick={handleAddOption}
            className={`flex items-center justify-center w-12 h-12 rounded-xl bg-primaryColor hover:bg-bubbleBtnStandardHover text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor`}
            aria-label="Add new option"
          >
            <Plus size={18} className="stroke-2" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <OptionItem
              key={tag.id}
              tag={tag}
              allTags={tags}
              doneTags={doneTags}
              darkMode={darkMode}
              handleColorChange={handleColorChange}
              handleRemoveOption={handleRemoveOption}
              handleEditOption={handleEditOption}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
