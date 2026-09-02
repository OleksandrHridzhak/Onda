import { Tag } from 'entities/Column';
import { ColumnEntrySnapshot } from 'entities/ColumnEntry';

/**
 * Get color for a tag.
 */
export const getColorForTag = (
    tag: Tag,
    index: number,
    colorOrder: string[],
): string => {
    return tag.color || colorOrder[index % colorOrder.length];
};

/**
 * Toggle option selection and update database
 */
export const handleOptionToggle = (
    optionId: string,
    selectedOptionIds: string[],
    onChange: (optionIds: string[]) => void,
    availableOptions: Tag[],
    selectedSnapshots: ColumnEntrySnapshot[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>,
): void => {
    const newIds = selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter((id) => id !== optionId)
        : [...selectedOptionIds, optionId];

    onChange(newIds);

    // Update local state for display (array of names)
    const newNames = newIds
        .map(
            (id) =>
                availableOptions.find((opt) => opt.id === id)?.name ||
                selectedSnapshots.find((opt) => opt.id === id)?.name,
        )
        .filter(Boolean) as string[];

    setSelectedValues(newNames);
};
