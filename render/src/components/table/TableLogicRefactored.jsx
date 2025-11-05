import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../../services/settingsDB';
import { createColumn } from '../utils/columnCreator';
import { deserializeColumns } from '../utils/columnHelpers';
import { 
  getAllColumns, 
  addColumn, 
  updateColumn,
  migrateColumnsFromWeeks,
  getColumnsOrder,
  updateColumnsOrder
} from '../../services/columnsDB';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_COLUMN = {
  ColumnId: 'days',
  Type: 'days',
  Name: 'Day',
  EmojiIcon: '',
  NameVisible: true,
};

export const useTableLogic = () => {
  const [columns, setColumns] = useState([]); // Масив екземплярів класів
  const [tableData, setTableData] = useState({});
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSummaryRow, setShowSummaryRow] = useState(false);
  const [headerLayout, setHeaderLayout] = useState('withWidget');

  // Завантаження колонок з бази
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Спочатку міграція (якщо потрібно)
        await migrateColumnsFromWeeks();
        
        // Завантажуємо колонки з нового сховища
        const [columnsData, columnOrderData] = await Promise.all([
          getAllColumns(),
          getColumnsOrder()
        ]);

        let fetchedColumns = [DAY_COLUMN];

        if (columnsData && columnsData.length > 0) {
          // Десеріалізація у класи
          const columnInstances = deserializeColumns(columnsData);
          fetchedColumns = [DAY_COLUMN, ...columnInstances];
        }

        // Застосування порядку колонок
        if (columnOrderData && columnOrderData.length > 0) {
          const orderedColumns = [DAY_COLUMN];
          columnOrderData.forEach(columnId => {
            const col = fetchedColumns.find(c => c.id === columnId);
            if (col) orderedColumns.push(col);
          });
          
          // Додаємо колонки які не в порядку
          fetchedColumns.forEach(column => {
            if (column.ColumnId !== 'days' && !orderedColumns.some(col => col.id === column.id)) {
              orderedColumns.push(column);
            }
          });
          fetchedColumns = orderedColumns;
        }

        setColumns(fetchedColumns);

        // Ініціалізація tableData з колонок
        const initialTableData = DAYS.reduce((acc, day) => {
          acc[day] = {};
          fetchedColumns.forEach(col => {
            if (col.ColumnId !== 'days' && col.type !== 'tasktable' && col.type !== 'todo') {
              // Для day-based колонок читаємо дані з col.days
              acc[day][col.id || col.ColumnId] = col.days?.[day] || '';
            }
          });
          return acc;
        }, {});
        setTableData(initialTableData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setColumns([DAY_COLUMN]);
        setTableData(DAYS.reduce((acc, day) => ({ ...acc, [day]: {} }), {}));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  // Додавання нової колонки
  const handleAddColumn = useCallback(async (type) => {
    try {
      const newColumn = createColumn(type);
      const columnJson = newColumn.toJSON();
      
      // Додаємо в базу
      const result = await addColumn(columnJson);
      
      if (result.status) {
        setColumns(prev => [...prev, newColumn]);
        
        // Оновлюємо порядок колонок
        const newOrder = columns.filter(c => c.ColumnId !== 'days').map(c => c.id);
        newOrder.push(newColumn.id);
        await updateColumnsOrder(newOrder);
        
        // Оновлюємо tableData для day-based колонок
        if (newColumn.days) {
          setTableData(prev => ({
            ...prev,
            ...DAYS.reduce((acc, day) => ({
              ...acc,
              [day]: { ...prev[day], [newColumn.id]: '' }
            }), {})
          }));
        }
      }
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  }, [columns]);

  // Оновлення значення у клітинці
  const handleCellChange = useCallback(async (day, columnId, value) => {
    const column = columns.find(col => col.id === columnId);
    if (!column || column.type === 'tasktable' || column.type === 'todo') return;

    // Миттєве оновлення UI
    setTableData(prev => ({
      ...prev,
      [day]: { ...prev[day], [columnId]: value }
    }));

    // Оновлення в екземплярі класу
    if (column.days) {
      column.days[day] = value;
    }

    try {
      await updateColumn(column.toJSON());
      setColumns(prev => prev.map(col => 
        col.id === columnId ? column : col
      ));
    } catch (err) {
      console.error('Update failed:', err);
      // Відкат
      if (column.days) {
        setTableData(prev => ({
          ...prev,
          [day]: { ...prev[day], [columnId]: column.days[day] }
        }));
      }
    }
  }, [columns]);

  // Додавання задачі (для tasktable)
  const handleAddTask = useCallback(async (columnId, taskText) => {
    const column = columns.find(col => (col.columnId || col.ColumnId) === columnId);
    if (!column || column.type !== 'tasktable') return;

    column.addTask(taskText, 'blue');

    try {
      await updateColumn({ ...column.toJSON(), ColumnId: columnId });
      setColumns(prev => prev.map(col => 
        (col.columnId || col.ColumnId) === columnId ? column : col
      ));
    } catch (err) {
      console.error('Update failed:', err);
    }
  }, [columns]);

  // Переміщення колонки
  const handleMoveColumn = useCallback(async (columnId, direction) => {
    const currentIndex = columns.findIndex(col => (col.columnId || col.ColumnId) === columnId);
    if ((direction === 'up' && currentIndex <= 1) || 
        (direction === 'down' && currentIndex === columns.length - 1)) return;

    const newColumns = [...columns];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newColumns[currentIndex], newColumns[newIndex]] = [newColumns[newIndex], newColumns[currentIndex]];
    
    setColumns(newColumns);

    try {
      const newColumnOrder = newColumns.map(col => col.columnId || col.ColumnId);
      await settingsService.updateColumnOrder(newColumnOrder);
    } catch (err) {
      console.error('Failed to update column order:', err);
    }
  }, [columns]);

  // Зміна ширини колонки
  const handleChangeWidth = useCallback(async (columnId, newWidth) => {
    const width = parseInt(newWidth);
    if (isNaN(width) || width < 50 || width > 1000) return;

    const column = columns.find(col => (col.columnId || col.ColumnId) === columnId);
    if (!column) return;

    column.setWidth(width);

    try {
      await updateColumn({ ...column.toJSON(), ColumnId: columnId });
      setColumns(prev => prev.map(col => 
        (col.columnId || col.ColumnId) === columnId ? column : col
      ));
    } catch (err) {
      console.error('Update failed:', err);
    }
  }, [columns]);

  return {
    columns,
    setColumns,
    tableData,
    setTableData,
    showColumnSelector,
    setShowColumnSelector,
    loading,
    showSummaryRow,
    headerLayout,
    handleAddColumn,
    handleCellChange,
    handleAddTask,
    handleMoveColumn,
    handleChangeWidth,
  };
};

// Допоміжні функції для рендерингу
export const getWidthStyle = (column) => {
  if (column.Type === 'days' || column.type === 'days') {
    return { width: '120px', minWidth: '120px' };
  }
  if (column.Type === 'filler' || column.type === 'filler') {
    return { width: 'auto', minWidth: '0px' };
  }
  const width = column.width || column.Width || 100;
  return { width: `${width}px`, minWidth: `${width}px` };
};

export const calculateSummary = (column, tableData) => {
  const type = column.type || column.Type;
  
  if (type === 'checkbox') {
    return DAYS.reduce((sum, day) => 
      sum + (tableData[day]?.[column.columnId || column.ColumnId] ? 1 : 0), 0
    );
  }
  
  if (type === 'numberbox') {
    return DAYS.reduce((sum, day) => 
      sum + (parseFloat(tableData[day]?.[column.columnId || column.ColumnId]) || 0), 0
    );
  }
  
  if (type === 'multi-select' || type === 'multicheckbox') {
    return DAYS.reduce((sum, day) => {
      const tags = tableData[day]?.[column.columnId || column.ColumnId];
      if (typeof tags === 'string' && tags.trim() !== '') {
        return sum + tags.split(', ').filter(tag => tag.trim() !== '').length;
      }
      return sum;
    }, 0);
  }
  
  if (type === 'todo') {
    const tasks = column.tasks || [];
    const completed = tasks.filter(task => task.completed).length;
    return `${completed}/${tasks.length}`;
  }
  
  if (type === 'tasktable') {
    const done = column.doneTags?.length || 0;
    const total = (column.options?.length || 0) + done;
    return `${done}/${total}`;
  }
  
  return type === 'days' ? '' : '-';
};
