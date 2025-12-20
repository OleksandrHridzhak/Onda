import { useState, useEffect } from 'react';
import { CheckboxCell } from './columns/CheckboxColumn/CheckboxCell';
import { NumberCell } from './columns/NumberColumn/NumberCell';
import { TagsCell } from './columns/TagsColumn/TagsCell';
import { NotesCell } from './columns/NotesColumn/NotesCell';
import { MultiCheckboxCell } from './columns/MultiCheckboxColumn/MultiCheckboxCell';
import { TodoCell } from './columns/TodoColumn/TodoCell';
import { TaskTableCell } from './columns/TaskTableColumn/TaskTableCell';
import { useSelector } from 'react-redux';
import { settingsService } from '../../services/settingsDB';
import { useColumnsData, DAYS } from './hooks/useColumnsData';
import { useTableHandlers } from './hooks/useTableHandlers';
import React from 'react';

const handleError = (message: string, error: any): void => {
  console.error(message, error);
};

/**
 * Основний хук логіки таблиці
 * Комбінує хуки для даних та обробників
 */
export const useTableLogic = () => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [showSummaryRow, setShowSummaryRow] = useState(false);
  const [headerLayout, setHeaderLayout] = useState('withWidget');

  // Завантаження даних колонок
  const {
    columns,
    setColumns,
    tableData,
    setTableData,
    loading,
    columnOrder,
    setColumnOrder,
  } = useColumnsData();

  // Обробники операцій
  const handlers = useTableHandlers(
    columns,
    setColumns,
    tableData,
    setTableData,
    setColumnOrder,
  );

  // Завантаження налаштувань
  useEffect(() => {
    settingsService
      .getSettings()
      .then((response: { status: string; data?: any; error?: any }) => {
        if (response.status === 'success' && response.data) {
          const { data } = response;
          if (typeof data?.table?.showSummaryRow === 'boolean') {
            setShowSummaryRow(data.table.showSummaryRow);
          }
          if (data?.header?.layout) {
            setHeaderLayout(data.header.layout);
          }
        }
      })
      .catch((err: any) => handleError('Error fetching settings:', err));
  }, []);

  // Слухач змін header layout
  useEffect(() => {
    const onHeaderChange = (e: any) => {
      if (e.detail?.layout) setHeaderLayout(e.detail.layout);
    };
    window.addEventListener('header-settings-changed', onHeaderChange);
    return () =>
      window.removeEventListener('header-settings-changed', onHeaderChange);
  }, []);

  return {
    columns,
    setColumns,
    tableData,
    setTableData,
    showColumnSelector,
    setShowColumnSelector,
    highlightedRow,
    setHighlightedRow,
    loading,
    showSummaryRow,
    columnOrder,
    headerLayout,
    ...handlers,
  };
};

/**
 * Повертає стилі ширини для колонки
 */
export const getWidthStyle = (column: any): React.CSSProperties => {
  if (column.type === 'days') return { width: '120px', minWidth: '120px' };
  if (column.type === 'filler') return { width: 'auto', minWidth: '0px' };
  return { width: `${column.width}px`, minWidth: `${column.width}px` };
};

/**
 * Обчислює сумарні значення для колонки
 */
export const calculateSummary = (
  column: any,
  tableData: any,
): string | number => {
  if (column.type === 'checkbox') {
    return DAYS.reduce(
      (sum, day) => sum + (tableData[day]?.[column.id] ? 1 : 0),
      0,
    );
  } else if (column.type === 'numberbox') {
    return DAYS.reduce(
      (sum, day) => sum + (parseFloat(tableData[day]?.[column.id]) || 0),
      0,
    );
  } else if (
    column.type === 'multi-select' ||
    column.type === 'multicheckbox'
  ) {
    return DAYS.reduce((sum, day) => {
      const tags = tableData[day]?.[column.id];
      if (typeof tags === 'string' && tags.trim() !== '') {
        return sum + tags.split(', ').filter((tag) => tag.trim() !== '').length;
      }
      return sum;
    }, 0);
  } else if (column.type === 'todo') {
    const todos = column.tasks || [];
    const completed = todos.filter((todo) => todo.completed).length;
    return `${completed}/${todos.length}`;
  } else if (column.type === 'tasktable') {
    return `${column.doneTags?.length || 0}/${(column.options?.length || 0) + (column.doneTags?.length || 0)}`;
  }
  return column.type === 'days' ? '' : '-';
};

interface RenderCellProps {
  day: string;
  column: any;
  columnIndex: number;
  rowIndex: number;
  tableData: any;
  darkMode: boolean;
  handleCellChange: (day: string, columnId: string, value: any) => void;
  handleChangeOptions: (
    columnId: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => void;
}

/**
 * Компонент для рендерингу клітинки
 */
export const RenderCell: React.FC<RenderCellProps> = ({
  day,
  column,
  columnIndex,
  rowIndex,
  tableData,
  darkMode,
  handleCellChange,
  handleChangeOptions,
}) => {
  const { theme, mode } = useSelector((state: any) => state.theme);
  const style = getWidthStyle(column);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const cellComponents = {
    checkbox: CheckboxCell,
    numberbox: NumberCell,
    'multi-select': TagsCell,
    text: NotesCell,
    multicheckbox: MultiCheckboxCell,
    todo: TodoCell,
    tasktable: TaskTableCell,
  };

  // Колонка "Day"
  if (column.type === 'days') {
    return (
      <td
        key={column.id}
        data-column-id={column.id}
        className={`px-4 py-3 text-sm font-medium text-textTableValues border-border border-r whitespace-nowrap`}
        style={style}
      >
        {day}
        {day === today && (
          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
        )}
      </td>
    );
  }

  // Filler колонка
  if (column.type === 'filler') {
    return <td key={column.id} data-column-id={column.id} style={style} />;
  }

  // Todo/TaskTable займають всі рядки, показуємо тільки в першому
  if ((column.type === 'todo' || column.type === 'tasktable') && rowIndex > 0) {
    return null;
  }

  const Component = cellComponents[column.type];
  if (!Component) return null;

  const props = {
    value:
      column.type === 'todo'
        ? column.tasks || []
        : tableData[day]?.[column.id] || '',
    column,
    onChange: (value) =>
      handleCellChange(
        column.type === 'todo' ? 'global' : day,
        column.id,
        value,
      ),
    darkMode,
    ...(column.type === 'checkbox' && {
      checked: !!tableData[day]?.[column.id],
      color: column.checkboxColor || 'green',
    }),
    ...(column.type === 'multi-select' || column.type === 'multicheckbox'
      ? { options: column.options || [], tagColors: column.tagColors || {} }
      : {}),
    ...(column.type === 'tasktable' && {
      onChangeOptions: handleChangeOptions,
    }),
  };

  return (
    <td
      key={column.id}
      data-column-id={column.id}
      className={`px-2 py-3 text-sm border-border text-textTableRealValues border-r ${
        column.type === 'todo' || column.type === 'tasktable' ? 'todo-cell' : ''
      }`}
      style={{
        ...style,
        ...(column.type === 'todo' || column.type === 'tasktable'
          ? { verticalAlign: 'top' }
          : {}),
      }}
      {...(column.type === 'todo' || column.type === 'tasktable'
        ? { rowSpan: DAYS.length }
        : {})}
    >
      <Component
        {...props}
        key={
          column.type === 'tasktable'
            ? `${column.id}-${(column.options || []).length}-${(column.doneTags || []).length}`
            : undefined
        }
      />
    </td>
  );
};

export { DAYS };
