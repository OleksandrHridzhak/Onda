import React from 'react';
import { COLOR_STYLES } from 'app/utils/colorOptions';
import { Tag } from 'app/types/newColumn.types';

interface TodoCategoryFilterProps {
    availableCategories: Tag[];
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
    selectedFilterCategoryId,
    setSelectedFilterCategoryId,
    setNewCategoryId,
}) => {
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
                        ? 'bg-primaryColor text-white'
                        : 'bg-secondary text-secondaryText'
                }`}
            >
                All Todos
            </button>
            {availableCategories.map((category) => {
                const colorOption = COLOR_STYLES[category.color];
                const categoryClasses =
                    selectedFilterCategoryId === category.id
                        ? `${colorOption?.bg} ${colorOption?.text}`
                        : 'bg-secondary text-secondaryText';

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
