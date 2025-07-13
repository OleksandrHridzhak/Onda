import { useState, useEffect, useCallback } from 'react';
import { CheckboxCell } from '../components/cells/CheckboxCell';
import { NumberCell } from '../components/cells/NumberCell';
import { TagsCell } from '../components/cells/TagsCell';
import { NotesCell } from '../components/cells/NotesCell';
import { MultiCheckboxCell } from '../components/cells/MultiCheckboxCell';
import { TodoCell } from '../components/cells/TodoCell';
import { TaskTableCell } from '../components/cells/TaskTableCell';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const COLUMN_WIDTHS = {
  days: '100px',
  checkbox: '100px',
  numberbox: '100px',
  'multi-select': '100px',
  text: '100px',
  tasktable: '100px',
  multicheckbox: '100px',
  todo: '1000px',
  filler: 'auto'
};

const electronAPI = window.electronAPI || {
  getAllDays: async () => ({ status: 'Data fetched', data: [] }),
  getSettings: async () => ({ status: 'Settings fetched', data: {} }),
  updateSettings: async () => {},
  createComponent: async () => ({ status: false }),
  updateColumnOrder: async () => {},
  changeColumn: async () => {}
};

const handleError = (message, error) => {
  console.error(message, error);
};

export const useTableLogic = () => {
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState({});
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSummaryRow, setShowSummaryRow] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);
  const [headerLayout, setHeaderLayout] = useState('withWidget');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [daysResult, settingsResult] = await Promise.all([
          electronAPI.getAllDays(),
          electronAPI.getSettings()
        ]);

        const dayColumn = { ColumnId: 'days', Type: 'days', Name: 'Day', EmojiIcon: '', NameVisible: true };
        let fetchedColumns = [dayColumn];

        if (daysResult.status === 'Data fetched' && Array.isArray(daysResult.data)) {
          fetchedColumns = [dayColumn, ...daysResult.data.map(col => ({
            ...col,
            Width: col.Width ? parseInt(col.Width) : null
          }))];
        }

        if (settingsResult.status === 'Settings fetched' && settingsResult.data.table?.columnOrder?.length > 0) {
          const orderedColumns = settingsResult.data.table.columnOrder
            .map(columnId => fetchedColumns.find(col => col.ColumnId === columnId))
            .filter(Boolean);
          fetchedColumns.forEach(column => {
            if (!orderedColumns.some(col => col.ColumnId === column.ColumnId)) {
              orderedColumns.push(column);
            }
          });
          fetchedColumns = orderedColumns;
        }

        setColumns(fetchedColumns);
        setColumnOrder(fetchedColumns.map(col => col.ColumnId));

        if (settingsResult.status === 'Settings fetched') {
          const newSettings = {
            ...settingsResult.data,
            table: { ...settingsResult.data.table, columnOrder: fetchedColumns.map(col => col.ColumnId) }
          };
          await electronAPI.updateSettings(newSettings);
        }

        const initialTableData = DAYS.reduce((acc, day) => {
          acc[day] = fetchedColumns.reduce((dayData, col) => {
            if (col.ColumnId !== 'days' && col.Type !== 'tasktable') {
              dayData[col.ColumnId] = col.Type === 'multi-select' || col.Type === 'multicheckbox'
                ? (typeof col.Chosen?.[day] === 'string' ? col.Chosen[day] : '')
                : col.Chosen?.[day] || '';
            }
            return dayData;
          }, {});
          return acc;
        }, {});
        setTableData(initialTableData);
      } catch (err) {
        handleError('Error fetching data:', err);
        setColumns([{ ColumnId: 'days', Type: 'days', Name: 'Day', EmojiIcon: '', NameVisible: true }]);
        setTableData(DAYS.reduce((acc, day) => ({ ...acc, [day]: {} }), {}));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      .catch(err => handleError('Error fetching settings:', err));
  }, []);

  useEffect(() => {
    const onHeaderChange = (e) => {
      if (e.detail?.layout) setHeaderLayout(e.detail.layout);
    };
    window.addEventListener('header-settings-changed', onHeaderChange);
    return () => window.removeEventListener('header-settings-changed', onHeaderChange);
  }, []);

  const handleAddColumn = useCallback(async (type) => {
    try {
      const result = await electronAPI.createComponent(type);
      if (result.status) {
        setColumns(prev => [...prev, result.data]);
        setTableData(prev => ({
          ...prev,
          ...DAYS.reduce((acc, day) => ({
            ...acc,
            [day]: { ...prev[day], [result.data.ColumnId]: type !== 'tasktable' ? '' : undefined }
          }), {})
        }));
      }
    } catch (err) {
      handleError('Failed to create column:', err);
    }
  }, [setColumns, setTableData]);

  const handleCellChange = useCallback(async (day, columnId, value) => {
    const column = columns.find(col => col.ColumnId === columnId);
    if (!column || column.Type === 'tasktable') return;

    // Нормалізуємо значення для чекбокса
    const normalizedValue = column.Type === 'checkbox' ? !!value : value;

    // Тимчасове оновлення для миттєвого відображення
    setTableData(prev => ({
      ...prev,
      [day]: { ...prev[day], [columnId]: normalizedValue }
    }));

    const updatedColumn = {
      ...column,
      Chosen: {
        ...(column.Chosen || {}),
        [day]: normalizedValue
      }
    };

    try {
      await electronAPI.changeColumn(updatedColumn);
      setColumns(prev => prev.map(col => col.ColumnId === columnId ? updatedColumn : col));
    } catch (err) {
      handleError('Update failed:', err);
      // Відкатуємо до попереднього значення
      setTableData(prev => ({
        ...prev,
        [day]: { ...prev[day], [columnId]: column.Chosen?.[day] || false }
      }));
    }
  }, [columns, setTableData, setColumns]);

  const handleAddTask = useCallback(async (columnId, taskText) => {
    const column = columns.find(col => col.ColumnId === columnId);
    if (!column || column.Type !== 'tasktable') return;

    const updatedOptions = [...(column.Options || []), taskText];
    const updatedTagColors = { ...column.TagColors, [taskText]: 'blue' };
    const updatedColumn = { ...column, Options: updatedOptions, TagColors: updatedTagColors };
    try {
      await electronAPI.changeColumn(updatedColumn);
      setColumns(prev => prev.map(col => col.ColumnId === columnId ? updatedColumn : col));
    } catch (err) {
      handleError('Update failed:', err);
    }
  }, [columns, setColumns]);

  const handleMoveColumn = useCallback(async (columnId, direction) => {
    const currentIndex = columns.findIndex(col => col.ColumnId === columnId);
    if ((direction === 'up' && currentIndex <= 1) || (direction === 'down' && currentIndex === columns.length - 1)) return;

    const newColumns = [...columns];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newColumns[currentIndex], newColumns[newIndex]] = [newColumns[newIndex], newColumns[currentIndex]];
    setColumns(newColumns);
    const newColumnOrder = newColumns.map(col => col.ColumnId);
    setColumnOrder(newColumnOrder);

    try {
      await electronAPI.updateColumnOrder(newColumnOrder);
    } catch (err) {
      handleError('Failed to update column order:', err);
    }
  }, [columns, setColumns, setColumnOrder]);

  const handleChangeWidth = useCallback(async (columnId, newWidth) => {
    const width = parseInt(newWidth);
    if (isNaN(width) || width < 50 || width > 1000) {
      handleError('Invalid width value', new Error('Width must be between 50 and 1000'));
      return;
    }
    const column = columns.find(col => col.ColumnId === columnId);
    if (!column) return;
    const updatedColumn = { ...column, Width: width };
    try {
      await electronAPI.changeColumn(updatedColumn);
      setColumns(prev => prev.map(col => col.ColumnId === columnId ? updatedColumn : col));
      document.querySelectorAll(`[data-column-id="${columnId}"]`).forEach(element => {
        element.style.width = `${width}px`;
      });
    } catch (err) {
      handleError('Update failed:', err);
    }
  }, [columns, setColumns]);

  const handleExport = useCallback(() => {
    const exportData = columns.filter(col => col.Type !== 'days').map(col => ({
      ...col,
      Chosen: col.Type !== 'tasktable' ? DAYS.reduce((acc, day) => ({
        ...acc,
        [day]: tableData[day]?.[col.ColumnId] || ''
      }), {}) : undefined
    }));
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planner-export.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [columns, tableData]);

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
    handleAddColumn,
    handleCellChange,
    handleAddTask,
    handleMoveColumn,
    handleChangeWidth,
    handleExport
  };
};

export const getWidthStyle = (column) => {
  if (column.Type === 'days') return { width: '120px', minWidth: '120px' };
  if (column.Type === 'filler') return { width: 'auto', minWidth: '0px' };
  return { width: `${column.Width}px`, minWidth: `${column.Width}px`};
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
        return sum + tags.split(', ').filter(tag => tag.trim() !== '').length;
      }
      return sum;
    }, 0);
  } else if (column.Type === 'todo') {
    const todos = column.Chosen?.global || [];
    const completed = todos.filter(todo => todo.completed).length;
    return `${completed}/${todos.length}`;
  } else if (column.Type === 'tasktable') {
    return `${column.DoneTags?.length || 0}/${(column.Options?.length || 0) + (column.DoneTags?.length || 0)}`;
  }
  return column.Type === 'days' ? '' : '-';
};

export const renderCell = (day, column, columnIndex, rowIndex, tableData, darkMode, handleCellChange, handleChangeOptions) => {
  const style = getWidthStyle(column);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const cellComponents = {
    checkbox: CheckboxCell,
    numberbox: NumberCell,
    'multi-select': TagsCell,
    text: NotesCell,
    multicheckbox: MultiCheckboxCell,
    todo: TodoCell,
    tasktable: TaskTableCell
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
    return (
      <td
        key={column.ColumnId}
        data-column-id={column.ColumnId}
        className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-r`}
        style={style}
      />
    );
  }

  if ((column.Type === 'todo' || column.Type === 'tasktable') && rowIndex > 0) {
    return null;
  }

  const Component = cellComponents[column.Type];
  if (!Component) return null;

  const props = {
    value: column.Type === 'todo' ? (column.Chosen?.global || []) : (tableData[day]?.[column.ColumnId] || ''),
    column,
    onChange: (value) => handleCellChange(column.Type === 'todo' ? 'global' : day, column.ColumnId, value),
    darkMode,
    ...(column.Type === 'checkbox' && { checked: !!tableData[day]?.[column.ColumnId], color: column.CheckboxColor || 'green' }), // Гарантуємо булеве значення
    ...(column.Type === 'multi-select' || column.Type === 'multicheckbox' ? { options: column.Options || [], tagColors: column.TagColors || {} } : {}),
    ...(column.Type === 'tasktable' && { onChangeOptions: handleChangeOptions })
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