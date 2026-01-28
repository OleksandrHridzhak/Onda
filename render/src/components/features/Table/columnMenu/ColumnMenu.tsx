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
import { getColumnById } from '../../../../db/helpers/columns';
import { getColumnsOrder } from '../../../../db/helpers/settings';
import { useColumnMenuHandlers } from './useColumnMenuHandlers';

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
    const [isColorMenuOpen, setIsColorMenuOpen] = useState<Record<string, boolean>>({});
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
        handleMoveUp: hookHandleMoveUp,
        handleMoveDown: hookHandleMoveDown,
        handleWidthChange: hookHandleWidthChange,
    } = useColumnMenuHandlers({ columnId, column, onClose });

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

        // Extract tags based on column type
        if (column.type === 'tagsColumn') {
            setTags(column.uniqueProps.availableTags || []);
        } else if (column.type === 'multiCheckBoxColumn') {
            setTags(column.uniqueProps.availableOptions || []);
        } else if (column.type === 'todoListColumn') {
            setTags(column.uniqueProps.availableCategories || []);
        } else if (column.type === 'taskTableColumn') {
            setTags(column.uniqueProps.availableTags || []);
        } else if (column.type === 'checkboxColumn') {
            setCheckboxColor(column.uniqueProps.checkboxColor || 'green');
        }
    }, [column, setTags]);

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

    const handleSave = () => {
        hookHandleSave(name, selectedIcon, description, showTitle, width, checkboxColor, setIsSaving);
    };

    const handleMoveUp = () => {
        hookHandleMoveUp(canMoveUp);
    };

    const handleMoveDown = () => {
        hookHandleMoveDown(canMoveDown);
    };

    const handleWidthChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
