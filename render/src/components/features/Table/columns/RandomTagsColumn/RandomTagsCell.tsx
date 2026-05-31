import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    getColorOptions,
    getCheckBoxColorOptions,
} from '../../../../../utils/colorOptions';
import { TagWithProbability } from '../../../../../types/newColumn.types';
import { Shuffle } from 'lucide-react';

interface RootState {
    newTheme: {
        themeMode: string;
    };
}

interface RandomTagsCellProps {
    selectedTagIds: string[];
    onChange: (tagIds: string[]) => void;
    availableTags: TagWithProbability[];
}

/**
 * RandomTagsCell component
 * Displays tags that were randomly assigned based on probability.
 * Includes a button to regenerate random tags.
 */
export const RandomTagsCell: React.FC<RandomTagsCellProps> = ({
    selectedTagIds,
    onChange,
    availableTags,
}) => {
    const { themeMode } = useSelector((state: RootState) => state.newTheme);
    const darkMode = themeMode === 'dark' ? true : false;
    const [isHovered, setIsHovered] = useState(false);

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

    // Get color option for a tag
    const getColorForTag = (tag: TagWithProbability) => {
        const colorValue = (tag.color || '').toLowerCase();
        const colorName = colorValue.startsWith('#')
            ? hexToName[colorValue] || 'blue'
            : colorValue || 'blue';

        return (
            colorOptions.find((opt) => opt.name === colorName) ||
            colorOptions[1]
        );
    };

    /**
     * Generate random tags based on probability
     * Each tag is selected independently based on its probability (0-100)
     */
    const generateRandomTags = (): string[] => {
        const randomTags: string[] = [];

        availableTags.forEach((tag) => {
            const random = Math.random() * 100;
            if (random < tag.probability) {
                randomTags.push(tag.id);
            }
        });

        return randomTags;
    };

    const handleRegenerate = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newTags = generateRandomTags();
        onChange(newTags);
    };

    return (
        <div
            className="relative px-2 py-1 md:px-0 md:py-0 flex items-center justify-between h-full w-full min-h-[2.5rem] md:min-h-[2rem]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {selectedTagIds.length > 0 ? (
                <div className="flex flex-wrap gap-1 flex-1">
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
                <div className="h-full w-full min-h-[2.5rem] md:min-h-[2rem] flex-1"></div>
            )}

            {isHovered && (
                <button
                    onClick={handleRegenerate}
                    className={`ml-2 p-1 rounded ${
                        darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Regenerate random tags"
                >
                    <Shuffle size={14} />
                </button>
            )}
        </div>
    );
};
