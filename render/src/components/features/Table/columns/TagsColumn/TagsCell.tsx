import React from 'react';
import { useSelector } from 'react-redux';
import { getColorOptions } from '../../../../../utils/colorOptions';
import { useDropdownMultiSelect } from '../hooks/useDropdownMultiSelect';

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

    const {
        isOpen,
        setIsOpen,
        selectedValues: selectedTags,
        setSelectedValues: setSelectedTags,
        dropdownRef,
    } = useDropdownMultiSelect(value);

    const colorOptions = getColorOptions({ darkMode });
    const handleTagChange = (
        tag: string,
        selectedTags: string[],
        setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>,
        onChange: (value: string) => void,
    ): void => {
        setSelectedTags((prevTags) => {
            const updatedTags = prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag];
            onChange(updatedTags.join(', '));
            return updatedTags;
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1 md:px-0 md:py-0 rounded-md cursor-pointer flex items-center justify-between h-full w-full min-h-[2.5rem] md:min-h-[2rem] bg-transparent hover:bg-transparent transition-colors"
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
                    <div className="h-full w-full min-h-[2.5rem] md:min-h-[2rem]"></div>
                )}
            </div>
            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className={`absolute z-10 mt-1 w-full ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-md shadow-lg max-h-48 overflow-auto`}
                >
                    {(options || []).map((option) => {
                        const color = tagColors[option] || 'blue';
                        const colorOption = colorOptions.find(
                            (opt) => opt.name === color,
                        );
                        return (
                            <div
                                key={option}
                                role="button"
                                tabIndex={0}
                                className={`px-3 py-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-blue-50 text-gray-800'} cursor-pointer text-sm whitespace-nowrap`}
                                onClick={() => {
                                    handleTagChange(
                                        option,
                                        selectedTags,
                                        setSelectedTags,
                                        onChange,
                                    );
                                    setIsOpen(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleTagChange(
                                            option,
                                            selectedTags,
                                            setSelectedTags,
                                            onChange,
                                        );
                                        setIsOpen(false);
                                    }
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
