import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { icons } from '../../../../utils/icons';
import { OptionsList } from './components/ui/OptionList';
import { CheckboxColorPicker } from './components/ui/CheckBoxColorPicker';
import { ColumnMenuHeader } from './components/structure/ColumnMenuHeader';
import { ColumnBasicSettings } from './components/structure/ColumnBasicSettings';
import { ColumnActions } from './components/structure/ColumnActions';
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
    const { form, actions, ui } = useColumnMenuHandlers({
        columnId,
        column,
        onClose,
    });

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
                        name={form.name}
                        setName={actions.setName}
                        selectedIcon={form.selectedIcon}
                        setSelectedIcon={actions.setSelectedIcon}
                        showTitle={form.showTitle}
                        setShowTitle={actions.setShowTitle}
                        isIconSectionExpanded={ui.isIconSectionExpanded}
                        setIsIconSectionExpanded={() =>
                            ui.setIsIconSectionExpanded(
                                !ui.isIconSectionExpanded,
                            )
                        }
                        icons={icons}
                        description={form.description}
                        setDescription={actions.setDescription}
                        width={form.width}
                        handleWidthChange={actions.handleWidthChange}
                        canMoveLeft={canMoveLeft}
                        canMoveRight={canMoveRight}
                        handleMoveLeft={actions.handleMoveLeft}
                        handleMoveRight={actions.handleMoveRight}
                        darkMode={darkMode}
                    />

                    {hasOptions && (
                        <OptionsList
                            columnType={column.type}
                            tags={form.tags}
                            newOption={form.newOption}
                            setNewOption={actions.setNewOption}
                            handleAddOption={actions.handleAddOption}
                            handleRemoveOption={actions.handleRemoveOption}
                            handleEditOption={actions.handleEditOption}
                            handleColorChange={actions.handleColorChange}
                            handleProbabilityChange={
                                actions.handleProbabilityChange
                            }
                            darkMode={darkMode}
                            isColorMenuOpen={ui.isColorMenuOpen}
                            toggleColorMenu={(tagId) =>
                                ui.setIsColorMenuOpen({
                                    ...ui.isColorMenuOpen,
                                    [tagId]: !ui.isColorMenuOpen[tagId],
                                })
                            }
                        />
                    )}

                    {column.type === COLUMN_TYPES.CHECKBOX && (
                        <CheckboxColorPicker
                            checkboxColor={form.checkboxColor}
                            setCheckboxColor={actions.setCheckboxColor}
                            darkMode={darkMode}
                            isColorMenuOpen={ui.isColorMenuOpen.checkbox}
                            toggleColorMenu={() =>
                                ui.setIsColorMenuOpen({
                                    ...ui.isColorMenuOpen,
                                    checkbox: !ui.isColorMenuOpen.checkbox,
                                })
                            }
                        />
                    )}

                    <ColumnActions
                        handleDelete={actions.handleDelete}
                        handleClear={actions.handleClear}
                        handleSave={actions.handleSave}
                        isSaving={ui.isSaving}
                    />
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default React.memo(ColumnMenu);
