import { Tag } from '../../../../../types/newColumn.types';
import { getCheckBoxColorOptions } from '../../../../../utils/colorOptions';

const COLOR_ORDER = ['green', 'blue', 'purple', 'orange'];

const COLOR_KEY_BY_HEX = (() => {
    const palette = getCheckBoxColorOptions({ darkMode: false });
    const map: Record<string, string> = {};

    Object.entries(palette).forEach(([key, value]) => {
        map[value.hex.toLowerCase()] = key;
    });

    return map;
})();

/**
 * Get color for a tag (handles both hex colors and color names)
 */
export const getColorForTag = (
    tag: Tag,
    index: number,
    colorOrder: string[],
): string => {
    const rawColor = tag.color || '';
    const lowerColor = rawColor.toLowerCase();

    // If the stored color is one of our named palette keys (hex)
    if (COLOR_KEY_BY_HEX[lowerColor]) {
        return COLOR_KEY_BY_HEX[lowerColor];
    }

    // Treat non-hex strings as direct palette keys
    if (!rawColor.startsWith('#') && rawColor) {
        return rawColor;
    }

    // Fallback to a deterministic color
    return colorOrder[index % colorOrder.length];
};

/**
 * Toggle option selection and update database
 */
export const handleOptionToggle = (
    optionId: string,
    selectedOptionIds: string[],
    onChange: (optionIds: string[]) => void,
    availableOptions: Tag[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>,
): void => {
    const newIds = selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter((id) => id !== optionId)
        : [...selectedOptionIds, optionId];

    onChange(newIds);

    // Update local state for display
    const newDisplayValue = newIds
        .map((id) => availableOptions.find((opt) => opt.id === id)?.name)
        .filter(Boolean)
        .join(', ');

    setSelectedValues(
        newDisplayValue
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
    );
};
