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

    // All state and handlers from custom hook
    const {
        name,
        setName,
        selectedIcon,
        setSelectedIcon,
        description,
        setDescription,
        showTitle,
        setShowTitle,
        width,
        checkboxColor,
        setCheckboxColor,
        isIconSectionExpanded,
        setIsIconSectionExpanded,
        isColorMenuOpen,
        setIsColorMenuOpen,
        isSaving,
        tags,
        newOption,
        setNewOption,
        handleAddOption,
        handleRemoveOption,
        handleEditOption,
        handleColorChange,
        handleSave,
        handleDelete,
        handleClear,
        handleMoveLeft,
        handleMoveRight,
        handleWidthChange,
    } = useColumnMenuHandlers({ columnId, column, onClose });

    const menuRef = useRef<HTMLDivElement>(null);
    const darkMode =
        document.documentElement.getAttribute('data-theme-mode') === 'dark';

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
                            columnType={column.type}
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
