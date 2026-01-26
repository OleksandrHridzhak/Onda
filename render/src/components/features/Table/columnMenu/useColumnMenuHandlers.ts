import { useState } from 'react';
import { Tag } from '../../../../types/newColumn.types';
import {
    updateColumnFields,
    deleteColumn,
    clearColumn,
    moveColumn,
} from '../../../../db/helpers/columns';

interface UseColumnMenuHandlersProps {
    columnId: string;
    column: any;
    onClose: () => void;
}

export const useColumnMenuHandlers = ({
    columnId,
    column,
    onClose,
}: UseColumnMenuHandlersProps) => {
    const [options, setOptions] = useState<string[]>([]);
    const [optionColors, setOptionColors] = useState<Record<string, string>>({});
    const [newOption, setNewOption] = useState('');

    const saveOptions = async (opts: string[], colors: Record<string, string>) => {
        const tags: Tag[] = opts.map((name) => ({
            id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
            name,
            color: colors[name] || 'blue',
        }));

        const updates: Record<string, Tag[]> = {};
        if (column.type === 'tagsColumn') {
            updates['uniqueProps.availableTags'] = tags;
        } else if (column.type === 'multiCheckBoxColumn') {
            updates['uniqueProps.availableOptions'] = tags;
        } else if (column.type === 'todoListColumn') {
            updates['uniqueProps.availableCategories'] = tags;
        } else if (column.type === 'taskTableColumn') {
            updates['uniqueProps.availableTags'] = tags;
        }

        await updateColumnFields(columnId, updates);
    };

    const handleAddOption = async () => {
        if (!newOption.trim() || options.includes(newOption.trim())) {
            return;
        }

        const updatedOptions = [...options, newOption.trim()];
        const updatedColors = { ...optionColors, [newOption.trim()]: 'blue' };

        setOptions(updatedOptions);
        setOptionColors(updatedColors);
        setNewOption('');

        await saveOptions(updatedOptions, updatedColors);
    };

    const handleRemoveOption = async (option: string) => {
        const updatedOptions = options.filter((o) => o !== option);
        const updatedColors = { ...optionColors };
        delete updatedColors[option];

        setOptions(updatedOptions);
        setOptionColors(updatedColors);

        await saveOptions(updatedOptions, updatedColors);
    };

    const handleEditOption = async (oldOption: string, newOption: string) => {
        const updatedOptions = options.map((o) => (o === oldOption ? newOption : o));
        const updatedColors = {
            ...optionColors,
            [newOption]: optionColors[oldOption],
        };
        delete updatedColors[oldOption];

        setOptions(updatedOptions);
        setOptionColors(updatedColors);

        await saveOptions(updatedOptions, updatedColors);
    };

    const handleColorChange = async (option: string, color: string) => {
        const updatedColors = { ...optionColors, [option]: color };
        setOptionColors(updatedColors);

        await saveOptions(options, updatedColors);
    };

    const handleSave = async (
        name: string,
        selectedIcon: string,
        description: string,
        showTitle: boolean,
        width: number,
        checkboxColor: string,
        setIsSaving: (value: boolean) => void
    ) => {
        setIsSaving(true);
        try {
            const updates: Record<string, string | number | boolean> = {};

            if (name !== column.name) {
                updates.name = name;
            }

            if (selectedIcon !== column.emojiIconName) {
                updates.emojiIconName = selectedIcon;
            }

            if (description !== column.description) {
                updates.description = description;
            }

            if (showTitle !== column.isNameVisible) {
                updates.isNameVisible = showTitle;
            }

            if (width !== column.width) {
                updates.width = width;
            }

            if (column.type === 'checkboxColumn' && checkboxColor !== column.uniqueProps.checkboxColor) {
                updates['uniqueProps.checkboxColor'] = checkboxColor;
            }

            if (Object.keys(updates).length > 0) {
                await updateColumnFields(columnId, updates);
            }

            onClose();
        } catch (error) {
            console.error('Error saving column changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (
            globalThis.confirm(
                `Are you sure you want to delete "${column.name || 'this column'}"? This action cannot be undone.`
            )
        ) {
            await deleteColumn(columnId);
            onClose();
        }
    };

    const handleClear = async () => {
        await clearColumn(columnId);
    };

    const handleMoveUp = async (canMoveUp: boolean) => {
        if (canMoveUp) {
            await moveColumn(columnId, 'left');
        }
    };

    const handleMoveDown = async (canMoveDown: boolean) => {
        if (canMoveDown) {
            await moveColumn(columnId, 'right');
        }
    };

    const handleWidthChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value, 10) || 0;
        await updateColumnFields(columnId, { width: newWidth });
        return newWidth;
    };

    return {
        options,
        setOptions,
        optionColors,
        setOptionColors,
        newOption,
        setNewOption,
        handleAddOption,
        handleRemoveOption,
        handleEditOption,
        handleColorChange,
        handleSave,
        handleDelete,
        handleClear,
        handleMoveUp,
        handleMoveDown,
        handleWidthChange,
    };
};
