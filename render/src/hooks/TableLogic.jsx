// useTableLogic.js
import { useState, useEffect, useCallback } from 'react';
import { CheckboxCell } from '../components/cells/CheckboxCell';
import { NumberCell } from '../components/cells/NumberCell';
import { TagsCell } from '../components/cells/TagsCell';
import { NotesCell } from '../components/cells/NotesCell';
import { MultiCheckboxCell } from '../components/cells/MultiCheckboxCell';
import { TodoCell } from '../components/cells/TodoCell';
import { TaskTableCell } from '../components/cells/TaskTableCell';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const electronAPI = window.electronAPI || {
  getSettings: async () => ({ status: 'Settings fetched', data: {} }),
  updateSettings: async () => {},
};

const handleError = (message, error) => {
  console.error(message, error);
};

export const useTableLogic = () => {
  const [tableData, setTableData] = useState({});
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showSummaryRow, setShowSummaryRow] = useState(false);
  const [headerLayout, setHeaderLayout] = useState('withWidget');

  useEffect(() => {
    electronAPI.getSettings()
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

  useEffect(() => {
    const onHeaderChange = (e) => {
      if (e.detail?.layout) setHeaderLayout(e.detail.layout);
    };
    window.addEventListener('header-settings-changed', onHeaderChange);
    return () => window.removeEventListener('header-settings-changed', onHeaderChange);
  }, []);

  const handleCellChange = useCallback(
    (day, columnId, value) => {
      setTableData((prev) => ({
        ...prev,
        [day]: { ...prev[day], [columnId]: value },
      }));
    },
    []
  );

  const handleExport = useCallback((columns) => {
    const exportData = columns
      .filter((col) => col.Type !== 'days')
      .map((col) => ({
        ...col,
        Chosen: col.Type !== 'tasktable' ? DAYS.reduce((acc, day) => ({ ...acc, [day]: tableData[day]?.[col.ColumnId] || '' }), {}) : undefined,
      }));
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planner-export.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [tableData]);

  return {
    tableData,
    setTableData,
    showColumnSelector,
    setShowColumnSelector,
    showSummaryRow,
    headerLayout,
    handleCellChange,
    handleExport,
  };
};

export const getWidthStyle = (column) => {
  if (column.Type === 'days') return { width: '120px', minWidth: '120px' };
  if (column.Type === 'filler') return { width: 'auto', minWidth: '0px' };
  return { width: `${column.Width}px`, minWidth: `${column.Width}px` };
};

export const calculateSummary = (column, tableData) => {
  if (column.Type === 'checkbox') {
    return DAYS.reduce((sum, day) => sum + (tableData[day]?.[column.ColumnId] ? 1 : 0), 0);
  } else if (column.Type === 'numberbox') {
    return DAYS.reduce((sum, day) => sum + (parseFloat(tableData[day]?.[column.ColumnId]) || 0), 0);
  } else if (column.Type === 'multi-select' || column.Type === 'multicheckbox') {
    return DAYS.reduce((sum, day) => {
      const tags = tableData[day]?.[column.ColumnId];
      if (typeof tags === 'string' && tags.trim() !== '') {
        return sum + tags.split(', ').filter((tag) => tag.trim() !== '').length;
      }
      return sum;
    }, 0);
  } else if (column.Type === 'todo') {
    const todos = column.Chosen?.global || [];
    const completed = todos.filter((todo) => todo.completed).length;
    return `${completed}/${todos.length}`;
  } else if (column.Type === 'tasktable') {
    return `${column.DoneTags?.length || 0}/${(column.Options?.length || 0) + (column.DoneTags?.length || 0)}`;
  }
  return column.Type === 'days' ? '' : '-';
};

export const renderCell = (day, column, columnIndex, rowIndex, tableData, darkMode, handleCellChange, handleOptionsChange) => {
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

  if (column.Type === 'days') {
    return (
      <td
        key={column.ColumnId}
        data-column-id={column.ColumnId}
        className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-600 border-gray-200'} border-r whitespace-nowrap`}
        style={style}
      >
        {day}
        {day === today && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
      </td>
    );
  }

  if (column.Type === 'filler') {
    return <td key={column.ColumnId} data-column-id={column.ColumnId} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-r`} style={style} />;
  }

  if ((column.Type === 'todo' || column.Type === 'tasktable') && rowIndex > 0) {
    return null;
  }

  const Component = cellComponents[column.Type];
  if (!Component) return null;

  const onCellChange = (value) => {
    const effectiveDay = column.Type === 'todo' ? 'global' : day;
    handleCellChange(effectiveDay, column.ColumnId, value);
    const normalizedValue = column.Type === 'checkbox' ? !!value : value;
    const updatedChosen = { ...column.Chosen || {}, [effectiveDay]: normalizedValue };
    dispatch(updateColumn({ ...column, Chosen: updatedChosen }));
  };

  const props = {
    value: column.Type === 'todo' ? (column.Chosen?.global || []) : (tableData[day]?.[column.ColumnId] || ''),
    column,
    onChange: onCellChange,
    darkMode,
    ...(column.Type === 'checkbox' && { checked: !!tableData[day]?.[column.ColumnId], color: column.CheckboxColor || 'green' }),
    ...(column.Type === 'multi-select' || column.Type === 'multicheckbox' ? { options: column.Options || [], tagColors: column.TagColors || {} } : {}),
    ...(column.Type === 'tasktable' && { onChangeOptions: handleOptionsChange }),
  };

  return (
    <td
      key={column.ColumnId}
      data-column-id={column.ColumnId}
      className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r ${column.Type === 'todo' || column.Type === 'tasktable' ? 'todo-cell' : ''}`}
      style={{ ...style, ...(column.Type === 'todo' || column.Type === 'tasktable' ? { verticalAlign: 'top' } : {}) }}
      {...(column.Type === 'todo' || column.Type === 'tasktable' ? { rowSpan: DAYS.length } : {})}
    >
      <Component {...props} />
    </td>
  );
};