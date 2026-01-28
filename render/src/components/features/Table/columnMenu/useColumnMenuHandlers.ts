import { useState } from 'react';
import { Tag, COLUMN_TYPES } from '../../../../types/newColumn.types';
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
    const [tags, setTags] = useState<Tag[]>([]);
    const [newOption, setNewOption] = useState('');

    const saveOptions = async (updatedTags: Tag[]) => {
        const updates: Record<string, Tag[]> = {};
        if (column.type === COLUMN_TYPES.TAGS) {
            updates['uniqueProps.availableTags'] = updatedTags;
        } else if (column.type === COLUMN_TYPES.MULTI_CHECKBOX) {
            updates['uniqueProps.availableOptions'] = updatedTags;
        } else if (column.type === COLUMN_TYPES.TODO_LIST) {
            updates['uniqueProps.availableCategories'] = updatedTags;
        } else if (column.type === COLUMN_TYPES.TASK_TABLE) {
            updates['uniqueProps.availableTags'] = updatedTags;
        }

        await updateColumnFields(columnId, updates);
    };

    const handleAddOption = async () => {
        if (!newOption.trim()) {
            return;
        }

        const newTag: Tag = {
            id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            name: newOption.trim(),
            color: 'blue',
        };

        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setNewOption('');

        await saveOptions(updatedTags);
    };

    const handleRemoveOption = async (tagId: string) => {
        const updatedTags = tags.filter((tag) => tag.id !== tagId);
        setTags(updatedTags);
        await saveOptions(updatedTags);
    };

    const handleEditOption = async (tagId: string, newName: string) => {
        const updatedTags = tags.map((tag) =>
            tag.id === tagId ? { ...tag, name: newName } : tag
        );
        setTags(updatedTags);
        await saveOptions(updatedTags);
    };

    const handleColorChange = async (tagId: string, color: string) => {
        const updatedTags = tags.map((tag) =>
            tag.id === tagId ? { ...tag, color } : tag
        );
        setTags(updatedTags);
        await saveOptions(updatedTags);
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

            if (column.type === COLUMN_TYPES.CHECKBOX && checkboxColor !== column.uniqueProps.checkboxColor) {
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
        const newWidth = parseInt(e.target.value, 10) || 100;
        await updateColumnFields(columnId, { width: newWidth });
        return newWidth;
    };

    return {
        tags,
        setTags,
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
