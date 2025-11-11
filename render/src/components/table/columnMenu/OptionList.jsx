import React from 'react';
import { Plus } from 'lucide-react';
import { OptionItem } from './OptionItem';
export const OptionsList = ({
  columnType,
  options,
  doneTags,
  newOption,
  setNewOption,
  handleAddOption,
  handleRemoveOption,
  handleEditOption,
  handleColorChange,
  optionColors,
  darkMode,
  toggleColorMenu,
}) => {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium text-textTableValues mb-1`}>
        {columnType === 'tasktable'
          ? 'Tasks'
          : columnType === 'multi-select'
            ? 'Tags'
            : columnType === 'todo'
              ? 'Categories'
              : 'Checkboxes'}
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
          {[...options, ...doneTags].map((option) => (
            <OptionItem
              key={option}
              option={option}
              options={options}
              doneTags={doneTags}
              optionColors={optionColors}
              darkMode={darkMode}
              handleColorChange={handleColorChange}
              handleRemoveOption={handleRemoveOption}
              handleEditOption={handleEditOption}
              toggleColorMenu={toggleColorMenu}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
