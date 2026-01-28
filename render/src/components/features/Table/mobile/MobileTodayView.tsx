import React, { useMemo, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';
import { CheckboxCell } from '../columns/CheckboxColumn/CheckBoxCell';
import { NumberboxCell } from '../columns/NumberboxColumn/NumberboxCell';
import { TextboxCell } from '../columns/TextboxColumn/TextboxCell';
import { TagsCell } from '../columns/TagsColumn/TagsCell';
import { MultiCheckboxCell } from '../columns/MultiCheckboxColumn/MultiCheckBoxCell';
import { TodoCell } from '../columns/TodoColumn/TodoCell';
import { TaskTableCell } from '../columns/TaskTableColumn/TaskTableCell';
import { MobileColumnMenu } from './MobileColumnMenu';
import { getIconComponent } from '../../../../utils/icons';
import { getMonday, getWeekDays, formatDateDisplay } from './dateUtils';
import { Tag, Todo } from '../../../../types/newColumn.types';
import { useLiveQuery } from 'dexie-react-hooks';
import { getAllColumns, updateColumnFields } from '../../../../db/helpers/columns';
import { getSettings } from '../../../../db/helpers/settings';

export const MobileTodayView: React.FC = () => {
    // Use dexie live queries to load columns and settings
    const columnOrder: string[] = useLiveQuery(async () => {
        const res = await getSettings();
        if (!res.success) {
            console.error('Failed to load settings for column order:', res.error);
            return [];
        }
        return res.data?.layout?.columnsOrder ?? [];
    }, []) ?? [];

    const columnsArray = useLiveQuery(async () => {
        const res = await getAllColumns();
        if (!res.success) {
            console.error('Failed to load columns:', res.error);
            return [];
        }
        return res.data;
    }, []) ?? [];

    // Convert columns array to dictionary for easier lookup
    const columnsData = useMemo(() => {
        const data: Record<string, any> = {};
        columnsArray.forEach(col => {
            data[col.id] = col;
        });
        return data;
    }, [columnsArray]);

    // Selected day state (defaults to today)
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

    // Column menu state (for mobile): which column's menu is open
    const [openColumnMenu, setOpenColumnMenu] = React.useState<string | null>(
        null,
    );

    // Use ref for today's date string to avoid recalculation on every render
    const todayDateString = React.useRef(new Date().toDateString()).current;

    // Memoized calculations
    const weekStart = useMemo(() => getMonday(selectedDate), [selectedDate]);
    const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
    const selectedDayName = useMemo(
        () =>
            selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
            }),
        [selectedDate],
    );
    const formattedDate = useMemo(
        () => formatDateDisplay(selectedDate),
        [selectedDate],
    );

    const handleTodayClick = useCallback(() => {
        setSelectedDate(new Date());
    }, []);

    const handleCellChange = useCallback(
        async (columnId: string, value: any) => {
            const column = columnsData[columnId];
            if (!column) return;

            // Preserve all existing uniqueProperties, only update the specific day
            const updatedDays = {
                ...(column.uniqueProperties?.Days || {}),
                [selectedDayName]: value,
            };

            const result = await updateColumnFields(columnId, {
                'uniqueProperties.Days': updatedDays,
            });

            if (!result.success) {
                console.error('Failed to update cell:', result.error);
            }
        },
        [columnsData, selectedDayName],
    );

    // Handler for Todo column changes
    const handleTodoChange = useCallback(
        async (columnId: string, newValue: Todo[]) => {
            const column = columnsData[columnId];
            if (!column) return;

            // Preserve all existing uniqueProperties, only update the specific path
            const updatedChosen = {
                ...(column.uniqueProperties?.Chosen || {}),
                global: newValue,
            };

            const result = await updateColumnFields(columnId, {
                'uniqueProperties.Chosen': updatedChosen,
            });

            if (!result.success) {
                console.error('Failed to update todo:', result.error);
            }
        },
        [columnsData],
    );

    // Handler for TaskTable column changes - curried version to avoid inline functions
    const createTaskTableHandler = useCallback(
        (columnId: string, columnData: any) => {
            return async (availableTags: Tag[], doneTasks: string[]) => {
                const options = availableTags.map((tag) => tag.name);
                const optionsColors: Record<string, string> = {};

                availableTags.forEach((tag) => {
                    optionsColors[tag.name] = tag.color || 'blue';
                });

                // Preserve all existing uniqueProperties, only update specific fields
                const result = await updateColumnFields(columnId, {
                    uniqueProperties: {
                        ...columnData.uniqueProperties,
                        Options: options,
                        OptionsColors: optionsColors,
                        DoneTags: doneTasks,
                    },
                });

                if (!result.success) {
                    console.error('Failed to update task table:', result.error);
                }
            };
        },
        [],
    );

    const renderCell = useCallback(
        (columnId: string, columnType: string, columnData: any) => {
            const cellValue =
                columnData.uniqueProperties?.Days?.[selectedDayName];

            switch (columnType) {
                case 'checkbox':
                    return (
                        <CheckboxCell
                            checked={cellValue || false}
                            onChange={(newValue) =>
                                handleCellChange(columnId, newValue)
                            }
                            color={
                                columnData.uniqueProperties?.CheckboxColor ||
                                '#3b82f6'
                            }
                        />
                    );

                case 'numberbox':
                    return (
                        <NumberboxCell
                            value={cellValue || ''}
                            onChange={(newValue) =>
                                handleCellChange(columnId, newValue)
                            }
                        />
                    );

                case 'text':
                    return (
                        <TextboxCell
                            value={cellValue || ''}
                            onChange={(newValue) =>
                                handleCellChange(columnId, newValue)
                            }
                        />
                    );

                case 'multiselect': {
                    const tagNames: string[] =
                        columnData.uniqueProperties?.Tags || [];
                    const tagColors: Record<string, string> =
                        columnData.uniqueProperties?.TagsColors || {};

                    const availableTags: Tag[] = tagNames.map(
                        (name: string) => ({
                            id: name,
                            name,
                            color: tagColors[name] || 'blue',
                        }),
                    );

                    const selectedTagIds: string[] = Array.isArray(cellValue)
                        ? cellValue
                        : typeof cellValue === 'string' && cellValue
                          ? cellValue
                                .split(',')
                                .map((s: string) => s.trim())
                                .filter(Boolean)
                          : [];

                    return (
                        <TagsCell
                            selectedTagIds={selectedTagIds}
                            onChange={(newTagIds) =>
                                handleCellChange(columnId, newTagIds)
                            }
                            availableTags={availableTags}
                        />
                    );
                }

                case 'multicheckbox': {
                    const optionNames: string[] =
                        columnData.uniqueProperties?.Options || [];
                    const optionColors: Record<string, string> =
                        columnData.uniqueProperties?.TagsColors ||
                        columnData.uniqueProperties?.OptionsColors ||
                        {};

                    const availableOptions: Tag[] = optionNames.map(
                        (name: string) => ({
                            id: name,
                            name,
                            color: optionColors[name] || 'blue',
                        }),
                    );

                    const selectedOptionIds: string[] = Array.isArray(cellValue)
                        ? cellValue
                        : typeof cellValue === 'string' && cellValue
                          ? cellValue
                                .split(',')
                                .map((s: string) => s.trim())
                                .filter(Boolean)
                          : [];

                    return (
                        <MultiCheckboxCell
                            selectedOptionIds={selectedOptionIds}
                            onChange={(newIds) =>
                                handleCellChange(columnId, newIds)
                            }
                            availableOptions={availableOptions}
                        />
                    );
                }

                case 'todo':
                    const globalTodos = (columnData.uniqueProperties?.Chosen
                        ?.global || []) as Todo[];

                    const categoryNames: string[] =
                        columnData.uniqueProperties?.Categorys || [];
                    const categoryColors: Record<string, string> =
                        columnData.uniqueProperties?.CategoryColors || {};

                    const availableCategories: Tag[] = categoryNames.map(
                        (name: string) => ({
                            id: name,
                            name,
                            color: categoryColors[name] || 'blue',
                        }),
                    );

                    return (
                        <TodoCell
                            value={globalTodos}
                            availableCategories={availableCategories}
                            columnId={columnId}
                            onChange={(newValue) =>
                                handleTodoChange(columnId, newValue)
                            }
                        />
                    );

                case 'tasktable': {
                    const optionNames: string[] =
                        columnData.uniqueProperties?.Options || [];
                    const optionColors: Record<string, string> =
                        columnData.uniqueProperties?.OptionsColors || {};

                    const availableTags: Tag[] = optionNames.map(
                        (name: string) => ({
                            id: name,
                            name,
                            color: optionColors[name] || 'blue',
                        }),
                    );

                    const doneTasks: string[] =
                        columnData.uniqueProperties?.DoneTags || [];

                    return (
                        <TaskTableCell
                            availableTags={availableTags}
                            doneTasks={doneTasks}
                            onChange={createTaskTableHandler(
                                columnId,
                                columnData,
                            )}
                        />
                    );
                }

                default:
                    return null;
            }
        },
        [
            handleCellChange,
            handleTodoChange,
            createTaskTableHandler,
            selectedDayName,
        ],
    );

    return (
        <div className="font-poppins p-3 bg-[var(--background)] min-h-screen h-screen overflow-y-auto pb-28 md:pb-0">
            {/* Fixed week selector header (mobile) */}
            <div className=" top-0 left-0 right-0 mb-2 z-40 bg-[var(--background)]  border-border md:relative md:top-0 md:border-b-0 md:bg-transparent">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    {/* Current date display with week navigation */}
                    <div className="flex items-center justify-center mb-3">
                        <button
                            onClick={handleTodayClick}
                            className="text-sm font-medium text-text text-center px-3 py-1 rounded-lg hover:bg-hoverBg transition-colors active:scale-95"
                            aria-label="Go to today"
                        >
                            {formattedDate}
                        </button>
                    </div>

                    {/* Days row - 7 columns for Mon-Sun */}
                    <div className="w-full">
                        <div className="grid grid-cols-7 gap-2">
                            {weekDays.map((d) => {
                                const short = d.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                });
                                const isActive =
                                    d.toDateString() ===
                                    selectedDate.toDateString();
                                const isToday =
                                    d.toDateString() === todayDateString;
                                return (
                                    <button
                                        key={d.toDateString()}
                                        onClick={() =>
                                            setSelectedDate(new Date(d))
                                        }
                                        className={`flex flex-col items-center justify-center border px-2 py-3 rounded-full text-xs transition-all active:scale-95 ${
                                            isActive
                                                ? 'bg-primaryColor text-white border-primaryColor shadow-md'
                                                : isToday
                                                  ? 'bg-tableHeader text-textTableValues border-primaryColor/30'
                                                  : 'bg-tableHeader text-textTableValues border-transparent'
                                        }`}
                                        aria-pressed={isActive}
                                        aria-label={`Select ${short}`}
                                    >
                                        <span className="font-medium">
                                            {short}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty state when no columns */}
            {columnOrder.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-textTableValues text-sm mb-2">
                        No columns yet
                    </p>
                    <p className="text-textTableValues text-xs">
                        Add columns to start tracking your tasks
                    </p>
                </div>
            )}

            {/* Columns as cards */}
            <div className="space-y-3 relative z-0">
                {openColumnMenu && (
                    <MobileColumnMenu
                        columnId={openColumnMenu}
                        onClose={() => setOpenColumnMenu(null)}
                    />
                )}
                {columnOrder.map((columnId: string) => {
                    const columnData = columnsData[columnId];
                    
                    // Skip if column data hasn't loaded yet
                    if (!columnData) {
                        return null;
                    }
                    
                    const cardKey = `${columnId}-${selectedDayName}`;
                    const columnType = columnData.type?.toLowerCase();

                    // Get the rendered cell to check if it's null
                    // Skip rendering the entire card if cell content is null
                    const renderedCell = renderCell(
                        columnId,
                        columnType,
                        columnData,
                    );
                    if (renderedCell === null) {
                        return null;
                    }

                    const compactTypes = [
                        'checkbox',
                        'numberbox',
                        'multicheckbox',
                        'multiselect',
                    ];
                    const isCompact = compactTypes.includes(columnType);

                    if (isCompact) {
                        return (
                            <div
                                key={cardKey}
                                className="bg-tableBodyBg border border-border rounded-lg p-3 flex items-center justify-between transition-all hover:shadow-sm"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {columnData.emojiIcon && (
                                        <span className="flex-shrink-0 text-text inline-flex items-center">
                                            {getIconComponent(
                                                columnData.emojiIcon,
                                                18,
                                            )}
                                        </span>
                                    )}
                                    <h3 className="text-sm font-medium text-text truncate">
                                        {columnData.name || columnType}
                                    </h3>
                                </div>

                                <div className="ml-3 flex items-center justify-end gap-2 flex-shrink-0">
                                    <div
                                        className={`${['multiselect', 'multicheckbox'].includes(columnType) ? 'min-w-[96px] md:min-w-[48px]' : 'min-w-[48px]'} flex items-center justify-center`}
                                    >
                                        {renderedCell}
                                    </div>
                                    <button
                                        aria-label={`Open settings for ${columnData.name || columnType}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenColumnMenu(columnId);
                                        }}
                                        className="p-2 rounded-md text-textTableValues hover:bg-hoverBg transition-colors active:scale-95"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={cardKey}
                            className="bg-tableBodyBg border border-border rounded-lg p-4 transition-all hover:shadow-sm"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-text flex items-center gap-2 flex-1 min-w-0">
                                    {columnData.emojiIcon && (
                                        <span className="inline-flex items-center flex-shrink-0">
                                            {getIconComponent(
                                                columnData.emojiIcon,
                                                18,
                                            )}
                                        </span>
                                    )}
                                    <span className="truncate">
                                        {columnData.name || columnType}
                                    </span>
                                </h3>
                                <button
                                    aria-label={`Open settings for ${columnData.name || columnType}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenColumnMenu(columnId);
                                    }}
                                    className="p-2 rounded-md text-textTableValues hover:bg-hoverBg transition-colors active:scale-95 flex-shrink-0"
                                >
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                            <div className="w-full">{renderedCell}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
