import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { icons } from '../../../../utils/icons';
import { BubbleBtn } from '../../../shared/BubbleBtn';
import { IconSelector } from './IconSelector';
import { TransparentBtn } from '../../../shared/TransparentBtn';
import { OptionsList } from './OptionList';
import { TitleVisibilityToggle } from './TitleVisibilityToggle';
import { CheckboxColorPicker } from './CheckBoxColorPicker';
import { Tag } from '../../../../types/newColumn.types';
import {
    getColumnById,
    updateColumnFields,
    deleteColumn,
    clearColumn,
    moveColumn,
} from '../../../../db/helpers/columns';
import { getColumnsOrder } from '../../../../db/helpers/settings';

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
    const [options, setOptions] = useState<string[]>([]);
    const [optionColors, setOptionColors] = useState<Record<string, string>>({});
    const [checkboxColor, setCheckboxColor] = useState('green');
    const [newOption, setNewOption] = useState('');
    const [isIconSectionExpanded, setIsIconSectionExpanded] = useState(false);
    const [isColorMenuOpen, setIsColorMenuOpen] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const darkMode = document.documentElement.getAttribute('data-theme-mode') === 'dark';

    // Initialize local state when column data loads
    useEffect(() => {
        if (!column) return;

        setName(column.name);
        setSelectedIcon(column.emojiIconName || '');
        setDescription(column.description || '');
        setShowTitle(column.isNameVisible !== false);
        setWidth(column.width || 0);

        // Extract options/tags based on column type
        if (column.type === 'tagsColumn') {
            const tags = column.uniqueProps.availableTags || [];
            setOptions(tags.map((t: Tag) => t.name));
            setOptionColors(
                tags.reduce((acc: Record<string, string>, t: Tag) => {
                    acc[t.name] = t.color;
                    return acc;
                }, {})
            );
        } else if (column.type === 'multiCheckBoxColumn') {
            const opts = column.uniqueProps.availableOptions || [];
            setOptions(opts.map((o: Tag) => o.name));
            setOptionColors(
                opts.reduce((acc: Record<string, string>, o: Tag) => {
                    acc[o.name] = o.color;
                    return acc;
                }, {})
            );
        } else if (column.type === 'todoListColumn') {
            const categories = column.uniqueProps.availableCategories || [];
            setOptions(categories.map((c: Tag) => c.name));
            setOptionColors(
                categories.reduce((acc: Record<string, string>, c: Tag) => {
                    acc[c.name] = c.color;
                    return acc;
                }, {})
            );
        } else if (column.type === 'taskTableColumn') {
            const tags = column.uniqueProps.availableTags || [];
            setOptions(tags.map((t: Tag) => t.name));
            setOptionColors(
                tags.reduce((acc: Record<string, string>, t: Tag) => {
                    acc[t.name] = t.color;
                    return acc;
                }, {})
            );
        } else if (column.type === 'checkboxColumn') {
            setCheckboxColor(column.uniqueProps.checkboxColor || 'green');
        }
    }, [column]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!column || !columnsOrder) {
        return null;
    }

    const currentIndex = columnsOrder.indexOf(columnId);
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < columnsOrder.length - 1;

    // Determine column type for options list
    const hasOptions = ['tagsColumn', 'todoListColumn', 'multiCheckBoxColumn', 'taskTableColumn'].includes(
        column.type
    );

    const handleAddOption = async () => {
        if (!newOption.trim() || options.includes(newOption.trim())) {
            return;
        }

        const updatedOptions = [...options, newOption.trim()];
        const updatedColors = { ...optionColors, [newOption.trim()]: 'blue' };

        setOptions(updatedOptions);
        setOptionColors(updatedColors);
        setNewOption('');

        // Save to DB immediately
        await saveOptions(updatedOptions, updatedColors);
    };

    const handleRemoveOption = async (option: string) => {
        const updatedOptions = options.filter((o) => o !== option);
        const updatedColors = { ...optionColors };
        delete updatedColors[option];

        setOptions(updatedOptions);
        setOptionColors(updatedColors);

        // Save to DB immediately
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

        // Save to DB immediately
        await saveOptions(updatedOptions, updatedColors);
    };

    const handleColorChange = async (option: string, color: string) => {
        const updatedColors = { ...optionColors, [option]: color };
        setOptionColors(updatedColors);

        // Save to DB immediately
        await saveOptions(options, updatedColors);
    };

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

    const handleMoveUp = async () => {
        if (canMoveUp) {
            await moveColumn(columnId, 'left');
        }
    };

    const handleMoveDown = async () => {
        if (canMoveDown) {
            await moveColumn(columnId, 'right');
        }
    };

    const handleWidthChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value, 10) || 0;
        setWidth(newWidth);
        await updateColumnFields(columnId, { width: newWidth });
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg z-55 font-semibold text-text`}>Column Settings</h2>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        aria-label="Close column settings"
                        className={`p-1 rounded-full text-textTableValues hover:bg-hoverBg transition-colors duration-200`}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="">
                    <div className="flex gap-2 w-full">
                        <IconSelector
                            selectedIcon={selectedIcon}
                            setSelectedIcon={setSelectedIcon}
                            isIconSectionExpanded={isIconSectionExpanded}
                            setIsIconSectionExpanded={() => setIsIconSectionExpanded(!isIconSectionExpanded)}
                            icons={icons}
                            darkMode={darkMode}
                        />
                        <div className="w-full flex relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full h-[50px] px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200`}
                                placeholder="Column name"
                            />
                            <TitleVisibilityToggle
                                showTitle={showTitle}
                                setShowTitle={setShowTitle}
                                darkMode={darkMode}
                            />
                        </div>
                    </div>
                    <div className="">
                        <textarea
                            value={description}
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200 resize-none`}
                            rows={3}
                        />
                    </div>
                    <div className="mb-4">
                        <label className={`block text-sm font-medium text-textTableValues mb-1`}>
                            Column Position and width
                        </label>
                        <div className="flex space-x-2">
                            <div className="w-full">
                                <input
                                    type="number"
                                    value={width}
                                    onChange={handleWidthChange}
                                    min="0"
                                    max="1000"
                                    className={`w-full px-3 py-2.5 flex items-center text-sm border bg-transparent border-border text-text rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primaryColor`}
                                    placeholder="Enter width in pixels"
                                    aria-label="Column width"
                                />
                            </div>
                            <TransparentBtn onClick={handleMoveUp} disabled={!canMoveUp} darkTheme={darkMode}>
                                <ArrowLeft size={18} /> LEFT
                            </TransparentBtn>
                            <TransparentBtn onClick={handleMoveDown} disabled={!canMoveDown} darkTheme={darkMode}>
                                RIGHT <ArrowRight size={18} />
                            </TransparentBtn>
                        </div>
                    </div>
                    {hasOptions && (
                        <OptionsList
                            columnType={getColumnTypeForOptions()}
                            options={options}
                            doneTags={[]} // Not used in new structure
                            newOption={newOption}
                            setNewOption={setNewOption}
                            handleAddOption={handleAddOption}
                            handleRemoveOption={handleRemoveOption}
                            handleEditOption={handleEditOption}
                            handleColorChange={handleColorChange}
                            optionColors={optionColors}
                            darkMode={darkMode}
                            isColorMenuOpen={isColorMenuOpen}
                            toggleColorMenu={(option) =>
                                setIsColorMenuOpen({
                                    ...isColorMenuOpen,
                                    [option]: !isColorMenuOpen[option],
                                })
                            }
                        />
                    )}
                    {column.type === 'checkboxColumn' && (
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
                    <div className="flex justify-between gap-2 mt-6">
                        <div className="flex gap-2">
                            <BubbleBtn onClick={handleDelete} disabled={isSaving} variant="delete">
                                Delete
                            </BubbleBtn>
                            <BubbleBtn onClick={handleClear} disabled={isSaving} variant="clear">
                                Clear column
                            </BubbleBtn>
                        </div>
                        <BubbleBtn onClick={handleSave} disabled={isSaving} variant="standard">
                            Save Changes
                        </BubbleBtn>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default React.memo(ColumnMenu);
