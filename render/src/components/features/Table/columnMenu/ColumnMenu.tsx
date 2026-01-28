import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { icons } from '../../../../utils/icons';
import { OptionsList } from './components/OptionList';
import { CheckboxColorPicker } from './components/CheckBoxColorPicker';
import { ColumnMenuHeader } from './components/ColumnMenuHeader';
import { ColumnBasicSettings } from './components/ColumnBasicSettings';
import { ColumnActions } from './components/ColumnActions';
import { getColumnById } from '../../../../db/helpers/columns';
import { getColumnsOrder } from '../../../../db/helpers/settings';
import { useColumnMenuHandlers } from './useColumnMenuHandlers';
import {
    COLUMN_TYPES,
    hasOptionsSupport,
} from '../../../../constants/columnTypes';

interface ColumnMenuProps {
    columnId: string;
    onClose: () => void;
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({ columnId, onClose }) => {
    // Fetch column data from Dexie using liveQuery
    const column = useLiveQuery(async () => {
        const result = await getColumnById(columnId);
        if (result.success) {
            return result.data;
        }
        console.error('Failed to fetch column:', result.error);
        return null;
    }, [columnId]);

    // Fetch column order to determine if can move
    const columnsOrder = useLiveQuery(async () => {
        const result = await getColumnsOrder();
        if (result.success) {
            return result.data;
        }
        return [];
    }, []);

    // Local state for editing
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [description, setDescription] = useState('');
    const [showTitle, setShowTitle] = useState(true);
    const [width, setWidth] = useState(0);
    const [checkboxColor, setCheckboxColor] = useState('green');
    const [isIconSectionExpanded, setIsIconSectionExpanded] = useState(false);
    const [isColorMenuOpen, setIsColorMenuOpen] = useState<
        Record<string, boolean>
    >({});
    const [isSaving, setIsSaving] = useState(false);

    // Use custom hook for handlers
    const {
        tags,
        setTags,
        newOption,
        setNewOption,
        handleAddOption,
        handleRemoveOption,
        handleEditOption,
        handleColorChange,
        handleSave: hookHandleSave,
        handleDelete,
        handleClear,
        handleMoveLeft: hookHandleMoveLeft,
        handleMoveRight: hookHandleMoveRight,
        handleWidthChange: hookHandleWidthChange,
    } = useColumnMenuHandlers({ columnId, column, onClose });

    const menuRef = useRef<HTMLDivElement>(null);
    const darkMode =
        document.documentElement.getAttribute('data-theme-mode') === 'dark';

    // Initialize local state when column data loads
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
            setCheckboxColor(column.uniqueProps.checkboxColor || 'green');
        }
    }, [column, setTags]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!column || !columnsOrder) {
        return null;
    }

    const currentIndex = columnsOrder.indexOf(columnId);
    const canMoveLeft = currentIndex > 0;
    const canMoveRight = currentIndex < columnsOrder.length - 1;

    // Determine column type for options list
    const hasOptions = hasOptionsSupport(column.type);

    const handleSave = () => {
        hookHandleSave(
            name,
            selectedIcon,
            description,
            showTitle,
            width,
            checkboxColor,
            setIsSaving,
        );
    };

    const handleMoveLeft = () => {
        hookHandleMoveLeft(canMoveLeft);
    };

    const handleMoveRight = () => {
        hookHandleMoveRight(canMoveRight);
    };

    const handleWidthChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newWidth = await hookHandleWidthChange(e);
        setWidth(newWidth);
    };

    // Map column type for OptionsList (which expects old type names)
    const getColumnTypeForOptions = () => {
        switch (column.type) {
            case 'tagsColumn':
                return 'multiselect';
            case 'todoListColumn':
                return 'todo';
            case 'multiCheckBoxColumn':
                return 'multicheckbox';
            case 'taskTableColumn':
                return 'tasktable';
            default:
                return column.type;
        }
    };

    return ReactDOM.createPortal(
        <div
            className={`fixed z-[99999] cursor-default inset-0 flex items-center justify-center bg-black bg-opacity-50 text-text`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            <div
                className={`w-full max-w-md rounded-2xl bg-background border-border border shadow-md p-4`}
                ref={menuRef}
            >
                <ColumnMenuHeader onClose={onClose} />

                <div className="">
                    <ColumnBasicSettings
                        name={name}
                        setName={setName}
                        selectedIcon={selectedIcon}
                        setSelectedIcon={setSelectedIcon}
                        showTitle={showTitle}
                        setShowTitle={setShowTitle}
                        isIconSectionExpanded={isIconSectionExpanded}
                        setIsIconSectionExpanded={() =>
                            setIsIconSectionExpanded(!isIconSectionExpanded)
                        }
                        icons={icons}
                        description={description}
                        setDescription={setDescription}
                        width={width}
                        handleWidthChange={handleWidthChange}
                        canMoveLeft={canMoveLeft}
                        canMoveRight={canMoveRight}
                        handleMoveLeft={handleMoveLeft}
                        handleMoveRight={handleMoveRight}
                        darkMode={darkMode}
                    />

                    {hasOptions && (
                        <OptionsList
                            columnType={getColumnTypeForOptions()}
                            tags={tags}
                            newOption={newOption}
                            setNewOption={setNewOption}
                            handleAddOption={handleAddOption}
                            handleRemoveOption={handleRemoveOption}
                            handleEditOption={handleEditOption}
                            handleColorChange={handleColorChange}
                            darkMode={darkMode}
                            isColorMenuOpen={isColorMenuOpen}
                            toggleColorMenu={(tagId) =>
                                setIsColorMenuOpen({
                                    ...isColorMenuOpen,
                                    [tagId]: !isColorMenuOpen[tagId],
                                })
                            }
                        />
                    )}

                    {column.type === COLUMN_TYPES.CHECKBOX && (
                        <CheckboxColorPicker
                            checkboxColor={checkboxColor}
                            setCheckboxColor={setCheckboxColor}
                            darkMode={darkMode}
                            isColorMenuOpen={isColorMenuOpen.checkbox}
                            toggleColorMenu={() =>
                                setIsColorMenuOpen({
                                    ...isColorMenuOpen,
                                    checkbox: !isColorMenuOpen.checkbox,
                                })
                            }
                        />
                    )}

                    <ColumnActions
                        handleDelete={handleDelete}
                        handleClear={handleClear}
                        handleSave={handleSave}
                        isSaving={isSaving}
                    />
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default React.memo(ColumnMenu);
