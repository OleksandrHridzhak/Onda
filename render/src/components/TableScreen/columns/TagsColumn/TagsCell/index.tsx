import React from 'react';
import { useSelector } from 'react-redux';
import { getColorOptions } from '../../../../utils/colorOptions';
import { useTagsDropdown } from './hooks/useTagsDropdown';
import { handleTagChange } from './logic';

interface RootState {
  newTheme: {
    themeMode: string;
  };
}

interface TagsCellProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  tagColors?: Record<string, string>;
}

export const TagsCell: React.FC<TagsCellProps> = ({
  value,
  onChange,
  options,
  tagColors = {},
}) => {
  const { themeMode } = useSelector((state: RootState) => state.newTheme);
  const darkMode = themeMode === 'dark' ? true : false;

  const { isOpen, setIsOpen, selectedTags, setSelectedTags, dropdownRef } =
    useTagsDropdown(value);

  const colorOptions = getColorOptions({ darkMode });

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
              const colorOption = colorOptions.find(
                (opt) => opt.name === color,
              );
              return (
                <span
                  key={tag}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${colorOption?.bg} ${colorOption?.text}`}
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
      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute z-10 mt-1 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg max-h-48 overflow-auto`}
        >
          {(options || []).map((option) => {
            const color = tagColors[option] || 'blue';
            const colorOption = colorOptions.find((opt) => opt.name === color);
            return (
              <div
                key={option}
                className={`px-3 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} cursor-pointer text-sm whitespace-nowrap`}
                onClick={() => {
                  handleTagChange(
                    option,
                    selectedTags,
                    setSelectedTags,
                    onChange,
                  );
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${colorOption?.bg} ${colorOption?.text} mr-2`}
                  >
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
