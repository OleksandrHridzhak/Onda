import React from 'react';
import { getColorOptions } from '../../../../../../utils/colorOptions';
import { Tag } from '../../../../../../types/newColumn.types';

interface TodoCategoryFilterProps {
    availableCategories: Tag[];
    darkMode: boolean;
    selectedFilterCategoryId: string;
    setSelectedFilterCategoryId: (categoryId: string) => void;
    setNewCategoryId: (categoryId: string) => void;
}

/**
 * TodoCategoryFilter component
 * Displays category filter buttons for filtering and selecting categories for new todos
 */
export const TodoCategoryFilter: React.FC<TodoCategoryFilterProps> = ({
    availableCategories,
    darkMode,
    selectedFilterCategoryId,
    setSelectedFilterCategoryId,
    setNewCategoryId,
}) => {
    const colorOptions = getColorOptions({ darkMode });

    if (!availableCategories?.length) return null;

    return (
        <div className="flex gap-2 flex-wrap">
            <button
                onClick={() => {
                    setSelectedFilterCategoryId('');
                    setNewCategoryId('');
                }}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedFilterCategoryId === ''
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
            {availableCategories.map((category) => {
                const colorOption = colorOptions.find(
                    (c) => c.name === category.color,
                );
                const categoryClasses =
                    selectedFilterCategoryId === category.id
                        ? `${colorOption?.bg} ${colorOption?.text}`
                        : darkMode
                          ? 'bg-gray-600 text-gray-200'
                          : 'bg-gray-200 text-gray-700';

                return (
                    <button
                        key={category.id}
                        onClick={() => {
                            setSelectedFilterCategoryId(category.id);
                            setNewCategoryId(category.id);
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${categoryClasses}`}
                    >
                        {category.name}
                    </button>
                );
            })}
        </div>
    );
};
