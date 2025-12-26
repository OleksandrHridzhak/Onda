import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { CheckboxCell } from './columns/CheckboxColumn/CheckboxCell';
import { NumberCell } from './columns/NumberColumn/NumberCell';
import { NotesCell } from './columns/NotesColumn/NotesCell';
import { TagsCell } from './columns/TagsColumn/TagsCell';
import { MultiCheckboxCell } from './columns/MultiCheckboxColumn/MultiCheckboxCell';
import { TodoCell } from './columns/TodoColumn/TodoCell';
import { TaskTableCell } from './columns/TaskTableColumn/TaskTableCell';
import {
  updateColumnNested,
  updateCommonColumnProperties,
} from '../../../store/tableSlice/tableSlice';
import { MobileColumnMenu } from './MobileColumnMenu';
import { getIconComponent } from '../../../utils/icons';
import {
  getMonday,
  getWeekDays,
  formatDateDisplay,
} from '../../../utils/dateUtils';

export const MobileTodayView: React.FC = () => {
  const dispatch = useDispatch();
  const columnOrder: string[] = useSelector(
    (state: Record<string, any>) => state.tableData?.columnOrder ?? [],
  );
  const columnsData = useSelector(
    (state: Record<string, any>) => state.tableData?.columns ?? {},
  );

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
    (columnId: string, value: any) => {
      dispatch(
        updateColumnNested({
          columnId,
          path: ['Days', selectedDayName],
          value,
        }),
      );
    },
    [dispatch, selectedDayName], // dispatch is stable but included for ESLint
  );

  // Handler for Todo column changes
  const handleTodoChange = useCallback(
    (columnId: string, newValue: any) => {
      dispatch(
        updateColumnNested({
          columnId,
          path: ['Chosen', 'global'],
          value: newValue,
        }),
      );
    },
    [dispatch], // dispatch is stable but included for ESLint
  );

  // Handler for TaskTable column changes - curried version to avoid inline functions
  const createTaskTableHandler = useCallback(
    (columnId: string, columnData: any) => {
      return (
        id: string,
        incomplete: string[],
        tagColors: Record<string, string>,
        completed: string[],
      ) => {
        dispatch(
          updateCommonColumnProperties({
            columnId: id,
            properties: {
              uniqueProperties: {
                ...columnData.uniqueProperties,
                Options: incomplete,
                OptionsColors: tagColors,
                DoneTags: completed,
              },
            },
          }),
        );
      };
    },
    [dispatch], // dispatch is stable but included for ESLint
  );

  const renderCell = useCallback(
    (columnId: string, columnType: string, columnData: any) => {
      const cellValue = columnData.uniqueProperties?.Days?.[selectedDayName];

      switch (columnType) {
        case 'checkbox':
          return (
            <CheckboxCell
              checked={cellValue || false}
              onChange={(newValue) => handleCellChange(columnId, newValue)}
              color={columnData.uniqueProperties?.CheckboxColor || '#3b82f6'}
            />
          );

        case 'numberbox':
          return (
            <NumberCell
              value={cellValue || ''}
              onChange={(newValue) => handleCellChange(columnId, newValue)}
            />
          );

        case 'text':
          return (
            <NotesCell
              value={cellValue || ''}
              onChange={(newValue) => handleCellChange(columnId, newValue)}
            />
          );

        case 'multiselect':
          return (
            <TagsCell
              value={cellValue || ''}
              onChange={(newValue) => handleCellChange(columnId, newValue)}
              options={columnData.uniqueProperties?.Tags || []}
              tagColors={columnData.uniqueProperties?.TagsColors || {}}
            />
          );

        case 'multicheckbox':
          return (
            <MultiCheckboxCell
              value={cellValue || ''}
              onChange={(newValue) => handleCellChange(columnId, newValue)}
              options={columnData.uniqueProperties?.Options || []}
              tagColors={columnData.uniqueProperties?.TagsColors || {}}
            />
          );

        case 'todo':
          const globalTodos = columnData.uniqueProperties?.Chosen?.global || [];

          return (
            <TodoCell
              value={globalTodos}
              column={{
                id: columnId,
                type: 'todo',
                options: columnData.uniqueProperties?.Categorys || [],
                tagColors: columnData.uniqueProperties?.CategoryColors || {},
              }}
              onChange={(newValue) => handleTodoChange(columnId, newValue)}
            />
          );

        case 'tasktable':
          return (
            <TaskTableCell
              column={{
                id: columnId,
                options: columnData.uniqueProperties?.Options || [],
                doneTags: columnData.uniqueProperties?.DoneTags || [],
                tagColors: columnData.uniqueProperties?.OptionsColors || {},
              }}
              onChangeOptions={createTaskTableHandler(columnId, columnData)}
            />
          );

        default:
          return <span className="text-gray-400">-</span>;
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
                  d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === todayDateString;
                return (
                  <button
                    key={d.toDateString()}
                    onClick={() => setSelectedDate(new Date(d))}
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
                    <span className="font-medium">{short}</span>
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
          <p className="text-textTableValues text-sm mb-2">No columns yet</p>
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
        {columnOrder
          .filter((columnId: string) => columnsData[columnId]) // Filter out missing columns to prevent empty blocks
          .map((columnId: string) => {
          const columnData = columnsData[columnId];
          if (!columnData) return null;
          const cardKey = `${columnId}-${selectedDayName}`;

          const columnType = columnData.Type?.toLowerCase();
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
                  {columnData.EmojiIcon && (
                    <span className="flex-shrink-0 text-text inline-flex items-center">
                      {getIconComponent(columnData.EmojiIcon, 18)}
                    </span>
                  )}
                  <h3 className="text-sm font-medium text-text truncate">
                    {columnData.Name || columnType}
                  </h3>
                </div>

                <div className="ml-3 flex items-center justify-end gap-2 flex-shrink-0">
                  <div
                    className={`${['multiselect', 'multicheckbox'].includes(columnType) ? 'min-w-[96px] md:min-w-[48px]' : 'min-w-[48px]'} flex items-center justify-center`}
                  >
                    {renderCell(columnId, columnType, columnData)}
                  </div>
                  <button
                    aria-label={`Open settings for ${columnData.Name || columnType}`}
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
                  {columnData.EmojiIcon && (
                    <span className="inline-flex items-center flex-shrink-0">
                      {getIconComponent(columnData.EmojiIcon, 18)}
                    </span>
                  )}
                  <span className="truncate">
                    {columnData.Name || columnType}
                  </span>
                </h3>
                <button
                  aria-label={`Open settings for ${columnData.Name || columnType}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenColumnMenu(columnId);
                  }}
                  className="p-2 rounded-md text-textTableValues hover:bg-hoverBg transition-colors active:scale-95 flex-shrink-0"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="w-full">
                {renderCell(columnId, columnType, columnData)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
