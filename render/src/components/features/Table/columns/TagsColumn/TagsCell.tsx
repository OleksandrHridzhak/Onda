import React from 'react';
import { useSelector } from 'react-redux';
import {
    getColorOptions,
    getCheckBoxColorOptions,
} from '../../../../../utils/colorOptions';
import { useDropdownMultiSelect } from '../hooks/useDropdownMultiSelect';
import { Tag } from '../../../../../types/newColumn.types';

interface RootState {
    newTheme: {
        themeMode: string;
    };
}

interface TagsCellProps {
    selectedTagIds: string[];
    onChange: (tagIds: string[]) => void;
    availableTags: Tag[];
}

/**
 * TagsCell component
 * Displays selected tags with a dropdown to add/remove tags.
 * Works directly with Tag objects and IDs (no name-based operations).
 */
export const TagsCell: React.FC<TagsCellProps> = ({
    selectedTagIds,
    onChange,
    availableTags,
}) => {
    const { themeMode } = useSelector((state: RootState) => state.newTheme);
    const darkMode = themeMode === 'dark' ? true : false;

    // Convert selected IDs to display value (comma-separated names)
    const displayValue = selectedTagIds
        .map((id) => availableTags.find((tag) => tag.id === id)?.name)
        .filter(Boolean)
        .join(', ');

    const {
        isOpen,
        setIsOpen,
        selectedValues,
        setSelectedValues,
        dropdownRef,
    } = useDropdownMultiSelect(displayValue);

    const colorOptions = getColorOptions({ darkMode });
    const checkboxColors = getCheckBoxColorOptions({ darkMode });

    // Map hex colors to color names
    const hexToName: Record<string, string> = {};
    Object.entries(checkboxColors).forEach(([name, cfg]) => {
        if (cfg.hex) {
            hexToName[cfg.hex.toLowerCase()] = name;
        }
    });

    // Get Tag object by ID
    const getTagById = (tagId: string) => {
        return availableTags.find((tag) => tag.id === tagId);
    };

    // Get color option for a tag (handles both hex and color names)
    const getColorForTag = (tag: Tag) => {
        const colorValue = (tag.color || '').toLowerCase();
        // Check if it's a hex color
        const colorName = colorValue.startsWith('#')
            ? hexToName[colorValue] || 'blue'
            : colorValue || 'blue';

        return (
            colorOptions.find((opt) => opt.name === colorName) ||
            colorOptions[1]
        );
    };

    const handleTagToggle = (tagId: string): void => {
        const newTagIds = selectedTagIds.includes(tagId)
            ? selectedTagIds.filter((id) => id !== tagId)
            : [...selectedTagIds, tagId];

        onChange(newTagIds);

        // Update local state for display
        const newDisplayValue = newTagIds
            .map((id) => availableTags.find((tag) => tag.id === id)?.name)
            .filter(Boolean)
            .join(', ');
        setSelectedValues(
            newDisplayValue
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1 md:px-0 md:py-0 rounded-md cursor-pointer flex items-center justify-between h-full w-full min-h-[2.5rem] md:min-h-[2rem] bg-transparent hover:bg-transparent transition-colors"
            >
                {selectedTagIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {selectedTagIds.map((tagId) => {
                            const tag = getTagById(tagId);
                            if (!tag) return null;

                            const colorOption = getColorForTag(tag);

                            return (
                                <span
                                    key={tagId}
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${colorOption.bg} ${colorOption.text}`}
                                >
                                    {tag.name}
                                </span>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full w-full min-h-[2.5rem] md:min-h-[2rem]"></div>
                )}
            </div>
            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className={`absolute z-10 mt-1 w-full ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-md shadow-lg max-h-48 overflow-auto`}
                >
                    {availableTags.map((tag) => {
                        const colorOption = getColorForTag(tag);

                        return (
                            <div
                                key={tag.id}
                                role="button"
                                tabIndex={0}
                                className={`px-3 py-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-blue-50 text-gray-800'} cursor-pointer text-sm whitespace-nowrap`}
                                onClick={() => {
                                    handleTagToggle(tag.id);
                                    setIsOpen(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleTagToggle(tag.id);
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${colorOption.bg} ${colorOption.text} mr-2`}
                                    >
                                        {tag.name}
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
