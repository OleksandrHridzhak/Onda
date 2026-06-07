import { useState, useEffect } from 'react';
import { Tag } from 'app/types/newColumn.types';
import { COLUMN_TYPES } from 'app/constants/columnTypes';
import { ColorName } from 'app/utils/colorOptions';
import {
    updateColumnFields,
    archiveColumn,
    permanentlyDeleteColumn,
    moveColumn,
} from 'db/helpers/columns';
import { useTableWeek } from 'features/Table/context/TableWeekContext';

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
    const { currentWeekStart } = useTableWeek();
    // All state management in one place
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [description, setDescription] = useState('');
    const [showTitle, setShowTitle] = useState(true);
    const [width, setWidth] = useState(0);
    const [checkboxColor, setCheckboxColor] = useState<ColorName>('accent1');
    const [isIconSectionExpanded, setIsIconSectionExpanded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [newOption, setNewOption] = useState('');

    // Initialize state when column data loads
    useEffect(() => {
        if (!column) return;

        setName(column.name);
        setSelectedIcon(column.emojiIconName || '');
        setDescription(column.description || '');
        setShowTitle(column.isNameVisible !== false);
        setWidth(column.width || 0);

        // Extract tags based on column type
        if (column.type === COLUMN_TYPES.TAGS) {
            setTags(column.uniqueProps.availableTags || []);
        } else if (column.type === COLUMN_TYPES.MULTI_CHECKBOX) {
            setTags(column.uniqueProps.availableOptions || []);
        } else if (column.type === COLUMN_TYPES.TODO) {
            setTags(column.uniqueProps.availableCategories || []);
        } else if (column.type === COLUMN_TYPES.TASK_TABLE) {
            setTags(column.uniqueProps.availableTags || []);
        } else if (column.type === COLUMN_TYPES.CHECKBOX) {
            setCheckboxColor(column.uniqueProps.checkboxColor || 'accent1');
        }
    }, [column]);

    const saveOptions = async (updatedTags: Tag[]) => {
        const updates: Record<string, Tag[]> = {};
        if (column.type === COLUMN_TYPES.TAGS) {
            updates['uniqueProps.availableTags'] = updatedTags;
        } else if (column.type === COLUMN_TYPES.MULTI_CHECKBOX) {
            updates['uniqueProps.availableOptions'] = updatedTags;
        } else if (column.type === COLUMN_TYPES.TODO) {
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
            id:
                globalThis.crypto?.randomUUID?.() ||
                `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            name: newOption.trim(),
            color: 'accent2',
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
            tag.id === tagId ? { ...tag, name: newName } : tag,
        );
        setTags(updatedTags);
        await saveOptions(updatedTags);
    };

    const handleColorChange = async (tagId: string, color: ColorName) => {
        const updatedTags = tags.map((tag) =>
            tag.id === tagId ? { ...tag, color } : tag,
        );
        setTags(updatedTags);
        await saveOptions(updatedTags);
    };

    const handleSave = async () => {
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

            if (
                column.type === COLUMN_TYPES.CHECKBOX &&
                checkboxColor !== column.uniqueProps.checkboxColor
            ) {
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

    const handleArchive = async () => {
        await archiveColumn(columnId, currentWeekStart);
        onClose();
    };

    const handlePermanentDelete = async () => {
        await permanentlyDeleteColumn(columnId);
        onClose();
    };

    const handleMoveLeft = async () => {
        await moveColumn(columnId, 'left');
    };

    const handleMoveRight = async () => {
        await moveColumn(columnId, 'right');
    };

    const handleWidthChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newWidth = parseInt(e.target.value, 10) || 100;
        setWidth(newWidth);
        await updateColumnFields(columnId, { width: newWidth });
    };

    return {
        form: {
            name,
            selectedIcon,
            description,
            showTitle,
            width,
            checkboxColor,
            tags,
            newOption,
        },
        actions: {
            setName,
            setSelectedIcon,
            setDescription,
            setShowTitle,
            setCheckboxColor,
            setTags,
            setNewOption,
            handleSave,
            handleArchive,
            handlePermanentDelete,
            handleMoveLeft,
            handleMoveRight,
            handleWidthChange,
            handleAddOption,
            handleRemoveOption,
            handleEditOption,
            handleColorChange,
        },
        ui: {
            isIconSectionExpanded,
            setIsIconSectionExpanded,
            isSaving,
        },
    };
};
