import { useState, useEffect } from 'react';
import { CheckboxCell } from './cells/CheckboxCell';
import { NumberCell } from './cells/NumberCell';
import { TagsCell } from './cells/TagsCell';
import { NotesCell } from './cells/NotesCell';
import { MultiCheckboxCell } from './cells/MultiCheckboxCell';
import { TodoCell } from './cells/TodoCell';
import { TaskTableCell } from './cells/TaskTableCell';
import { useSelector } from 'react-redux';
import { settingsService } from '../../services/settingsDB';
import { useColumnsData, DAYS } from './hooks/useColumnsData';
import { useTableHandlers } from './hooks/useTableHandlers';

const handleError = (message, error) => {
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
  const handlers = useTableHandlers(columns, setColumns, tableData, setTableData, setColumnOrder);

  // Завантаження налаштувань
  useEffect(() => {
    settingsService.getSettings()
      .then(({ data }) => {
        if (typeof data?.table?.showSummaryRow === 'boolean') {
          setShowSummaryRow(data.table.showSummaryRow);
        }
        if (data?.header?.layout) {
          setHeaderLayout(data.header.layout);
        }
      })
      .catch((err) => handleError('Error fetching settings:', err));
  }, []);

  // Слухач змін header layout
  useEffect(() => {
    const onHeaderChange = (e) => {
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
export const getWidthStyle = (column) => {
  if (column.Type === 'days') return { width: '120px', minWidth: '120px' };
  if (column.Type === 'filler') return { width: 'auto', minWidth: '0px' };
  return { width: `${column.Width}px`, minWidth: `${column.Width}px` };
};

/**
 * Обчислює сумарні значення для колонки
 */
export const calculateSummary = (column, tableData) => {
  if (column.Type === 'checkbox') {
    return DAYS.reduce(
      (sum, day) => sum + (tableData[day]?.[column.ColumnId] ? 1 : 0),
      0
    );
  } else if (column.Type === 'numberbox') {
    return DAYS.reduce(
      (sum, day) => sum + (parseFloat(tableData[day]?.[column.ColumnId]) || 0),
      0
    );
  } else if (column.Type === 'multi-select' || column.Type === 'multicheckbox') {
    return DAYS.reduce((sum, day) => {
      const tags = tableData[day]?.[column.ColumnId];
      if (typeof tags === 'string' && tags.trim() !== '') {
        return sum + tags.split(', ').filter((tag) => tag.trim() !== '').length;
      }
      return sum;
    }, 0);
  } else if (column.Type === 'todo') {
    const todos = column.Chosen || [];
    const completed = todos.filter((todo) => todo.completed).length;
    return `${completed}/${todos.length}`;
  } else if (column.Type === 'tasktable') {
    return `${column.DoneTags?.length || 0}/${(column.Options?.length || 0) + (column.DoneTags?.length || 0)}`;
  }
  return column.Type === 'days' ? '' : '-';
};

/**
 * Компонент для рендерингу клітинки
 */
export const RenderCell = ({
  day,
  column,
  columnIndex,
  rowIndex,
  tableData,
  darkMode,
  handleCellChange,
  handleChangeOptions,
}) => {
  const { theme, mode } = useSelector((state) => state.theme);
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
  if (column.Type === 'days') {
    return (
      <td
        key={column.ColumnId}
        data-column-id={column.ColumnId}
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
  if (column.Type === 'filler') {
    return <td key={column.ColumnId} data-column-id={column.ColumnId} style={style} />;
  }

  // Todo/TaskTable займають всі рядки, показуємо тільки в першому
  if ((column.Type === 'todo' || column.Type === 'tasktable') && rowIndex > 0) {
    return null;
  }

  const Component = cellComponents[column.Type];
  if (!Component) return null;

  const props = {
    value:
      column.Type === 'todo'
        ? column.Chosen || []
        : tableData[day]?.[column.ColumnId] || '',
    column,
    onChange: (value) =>
      handleCellChange(
        column.Type === 'todo' ? 'global' : day,
        column.ColumnId,
        value
      ),
    darkMode,
    ...(column.Type === 'checkbox' && {
      checked: !!tableData[day]?.[column.ColumnId],
      color: column.CheckboxColor || 'green',
    }),
    ...(column.Type === 'multi-select' || column.Type === 'multicheckbox'
      ? { options: column.Options || [], tagColors: column.TagColors || {} }
      : {}),
    ...(column.Type === 'tasktable' && {
      onChangeOptions: handleChangeOptions,
    }),
  };

  return (
    <td
      key={column.ColumnId}
      data-column-id={column.ColumnId}
      className={`px-2 py-3 text-sm border-border text-textTableRealValues border-r ${
        column.Type === 'todo' || column.Type === 'tasktable' ? 'todo-cell' : ''
      }`}
      style={{
        ...style,
        ...(column.Type === 'todo' || column.Type === 'tasktable'
          ? { verticalAlign: 'top' }
          : {}),
      }}
      {...(column.Type === 'todo' || column.Type === 'tasktable'
        ? { rowSpan: DAYS.length }
        : {})}
    >
      <Component {...props} />
    </td>
  );
};

export { DAYS };
