import React from 'react';
import { getColorOptions } from '../../../../../../utils/colorOptions';

interface TodoCategoryFilterProps {
  column: {
    options?: string[];
    tagColors?: Record<string, string>;
  };
  darkMode: boolean;
  selectedFilterCategory: string;
  setSelectedFilterCategory: (category: string) => void;
  setNewCategory: (category: string) => void;
}

export const TodoCategoryFilter: React.FC<TodoCategoryFilterProps> = ({
  column,
  darkMode,
  selectedFilterCategory,
  setSelectedFilterCategory,
  setNewCategory,
}) => {
  const colorOptions = getColorOptions({ darkMode });

  if (!column?.options?.length) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => {
          setSelectedFilterCategory('');
          setNewCategory('');
        }}
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          selectedFilterCategory === ''
            ? darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : darkMode
              ? 'bg-gray-600 text-gray-200'
              : 'bg-gray-200 text-gray-700'
        }`}
      >
        All Todos
      </button>
      {column.options.map((category) => {
        const colorOption = colorOptions.find(
          (c) => c.name === column.tagColors[category],
        );
        const categoryClasses =
          selectedFilterCategory === category
            ? `${colorOption?.bg} ${colorOption?.text}`
            : darkMode
              ? 'bg-gray-600 text-gray-200'
              : 'bg-gray-200 text-gray-700';

        return (
          <button
            key={category}
            onClick={() => {
              setSelectedFilterCategory(category);
              setNewCategory(category);
            }}
            className={`px-2 py-1 rounded-full text-xs font-medium ${categoryClasses}`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
