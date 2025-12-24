import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    const date = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  const weekStart = getMonday(selectedDate);
  const weekDays = getWeekDays(weekStart);
  const selectedDayName = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
  });
  const formatSelectedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const todayDateString = new Date().toDateString();

  // Column menu state (for mobile): which column's menu is open
  const [openColumnMenu, setOpenColumnMenu] = React.useState<string | null>(
    null,
  );

  const handleCellChange = (columnId: string, value: any) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['Days', selectedDayName],
        value,
      }),
    );
  };

  const renderCell = (
    columnId: string,
    columnType: string,
    columnData: any,
  ) => {
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
        const handleTodoChange = (newValue: any) => {
          dispatch(
            updateColumnNested({
              columnId,
              path: ['Chosen', 'global'],
              value: newValue,
            }),
          );
        };

        return (
          <TodoCell
            value={globalTodos}
            column={{
              id: columnId,
              type: 'todo',
              options: columnData.uniqueProperties?.Categorys || [],
              tagColors: columnData.uniqueProperties?.CategoryColors || {},
            }}
            onChange={handleTodoChange}
          />
        );

      case 'tasktable':
        const handleTaskTableChange = (
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

        return (
          <TaskTableCell
            column={{
              id: columnId,
              options: columnData.uniqueProperties?.Options || [],
              doneTags: columnData.uniqueProperties?.DoneTags || [],
              tagColors: columnData.uniqueProperties?.OptionsColors || {},
            }}
            onChangeOptions={handleTaskTableChange}
          />
        );

      default:
        return <span className="text-gray-400">-</span>;
    }
  };

  return (
    <div className="font-poppins p-3 bg-[var(--background)] min-h-screen h-screen overflow-y-auto pb-28 md:pb-0">
      {/* Fixed week selector header (mobile) */}
      <div className="fixed top-0 left-0 right-0 z-40 h-22 bg-[var(--background)] border-b border-border md:relative md:top-0 md:border-b-0 md:bg-transparent">
        <div className="max-w-6xl mx-auto px-4 py-2 h-full flex flex-col justify-center">
          {/* Days row */}
          <div className="mt-2 w-full">
            <div className="flex gap-2 items-center overflow-x-auto pb-1">
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
                    className={`flex flex-col items-center justify-center border border-transparent min-w-[44px] px-5 py-4 rounded-full text-xs transition-all ${
                      isActive
                        ? 'bg-primaryColor text-white '
                        : isToday
                          ? 'bg-tableHeader text-textTableValues border border-visible border-primaryColor/30'
                          : 'bg-tableHeader text-textTableValues'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="font-medium">{short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-14 md:h-0" />

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
                className="bg-tableBodyBg border border-border rounded-lg p-2 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text truncate flex items-center">
                    {columnData.EmojiIcon && (
                      <span className="mr-2 inline-flex items-center">
                        {getIconComponent(columnData.EmojiIcon, 16)}
                      </span>
                    )}
                    {columnData.Name || columnType}
                  </h3>
                </div>

                <div className="ml-2 flex items-center justify-end gap-2">
                  <div className="min-w-[48px]">
                    {renderCell(columnId, columnType, columnData)}
                  </div>
                  <button
                    aria-label="Open column settings"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenColumnMenu(columnId);
                    }}
                    className="p-1 rounded-md text-textTableValues hover:bg-hoverBg transition-colors"
                  >
                    ⋯
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={cardKey}
              className="bg-tableBodyBg border border-border rounded-lg p-4 "
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text flex items-center">
                  {columnData.EmojiIcon && (
                    <span className="mr-2 inline-flex items-center">
                      {getIconComponent(columnData.EmojiIcon, 16)}
                    </span>
                  )}
                  {columnData.Name || columnType}
                </h3>
                <button
                  aria-label="Open column settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenColumnMenu(columnId);
                  }}
                  className="p-1 rounded-md text-textTableValues hover:bg-hoverBg transition-colors"
                >
                  ⋯
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
