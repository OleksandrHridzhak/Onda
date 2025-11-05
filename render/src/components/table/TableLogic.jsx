import { useState, useEffect, useCallback } from 'react';
import { CheckboxCell } from './cells/CheckboxCell';
import { NumberCell } from './cells/NumberCell';
import { TagsCell } from './cells/TagsCell';
import { NotesCell } from './cells/NotesCell';
import { MultiCheckboxCell } from './cells/MultiCheckboxCell';
import { TodoCell } from './cells/TodoCell';
import { TaskTableCell } from './cells/TaskTableCell';
import { useSelector } from 'react-redux';
import { settingsService } from '../../services/settingsDB';
import { 
  getAllColumns, 
  addColumn, 
  updateColumn,
  migrateColumnsFromWeeks,
  getColumnsOrder,
  updateColumnsOrder
} from '../../services/columnsDB';
import { createColumn } from '../utils/columnCreator';
import { deserializeColumns } from '../utils/columnHelpers';

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

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
        
        // Міграція старих даних (якщо потрібно)
        await migrateColumnsFromWeeks();
        
        // Завантажуємо колонки з нового сховища
        const [columnsData, settingsResult, columnOrderData] = await Promise.all([
          getAllColumns(),
          settingsService.getSettings(),
          getColumnsOrder()
        ]);

        const dayColumn = {
          ColumnId: 'days',
          Type: 'days',
          Name: 'Day',
          EmojiIcon: '',
          NameVisible: true,
        };
        let fetchedColumns = [dayColumn];

        if (columnsData && columnsData.length > 0) {
          // Десеріалізація у класи та конвертація в старий формат для сумісності
          const columnInstances = deserializeColumns(columnsData);
          const compatibleColumns = columnInstances.map(col => ({
            ColumnId: col.id,
            Type: col.type,
            Name: col.description || 'Column',
            EmojiIcon: col.emojiIcon,
            NameVisible: col.nameVisible,
            Width: col.width,
            Description: col.description,
            // Для day-based колонок
            Chosen: col.days || col.tasks,
            // Додаткові поля
            Options: col.options,
            TagColors: col.tagColors,
            CheckboxColor: col.checkboxColor,
            DoneTags: col.doneTags,
            // Зберігаємо оригінальний екземпляр класу
            _instance: col
          }));
          fetchedColumns = [dayColumn, ...compatibleColumns];
        }

        // Застосування порядку колонок
        if (columnOrderData && columnOrderData.length > 0) {
          const orderedColumns = [dayColumn];
          columnOrderData.forEach(columnId => {
            const col = fetchedColumns.find(c => c.ColumnId === columnId || c._instance?.id === columnId);
            if (col) orderedColumns.push(col);
          });
          
          // Додаємо колонки які не в порядку
          fetchedColumns.forEach(column => {
            if (column.ColumnId !== 'days' && !orderedColumns.some(col => col.ColumnId === column.ColumnId)) {
              orderedColumns.push(column);
            }
          });
          fetchedColumns = orderedColumns;
        } else if (
          settingsResult.status === 'Settings fetched' &&
          settingsResult.data.table?.columnOrder?.length > 0
        ) {
          const orderedColumns = settingsResult.data.table.columnOrder
            .map((columnId) =>
              fetchedColumns.find((col) => col.ColumnId === columnId)
            )
            .filter(Boolean);
          fetchedColumns.forEach((column) => {
            if (
              !orderedColumns.some((col) => col.ColumnId === column.ColumnId)
            ) {
              orderedColumns.push(column);
            }
          });
          fetchedColumns = orderedColumns;
        }

        setColumns(fetchedColumns);
        setColumnOrder(fetchedColumns.map((col) => col.ColumnId));

        if (settingsResult.status === 'Settings fetched') {
          const newSettings = {
            ...settingsResult.data,
            table: {
              ...settingsResult.data.table,
              columnOrder: fetchedColumns.map((col) => col.ColumnId),
            },
          };
          await settingsService.updateSettings(newSettings);
        }

        const initialTableData = DAYS.reduce((acc, day) => {
          acc[day] = fetchedColumns.reduce((dayData, col) => {
            if (col.ColumnId !== 'days' && col.Type !== 'tasktable' && col.Type !== 'todo') {
              // Спочатку пробуємо взяти з _instance.days, потім з Chosen
              const dayValue = col._instance?.days?.[day] ?? col.Chosen?.[day] ?? '';
              
              dayData[col.ColumnId] =
                col.Type === 'multi-select' || col.Type === 'multicheckbox'
                  ? typeof dayValue === 'string'
                    ? dayValue
                    : ''
                  : dayValue;
            }
            return dayData;
          }, {});
          return acc;
        }, {});
        setTableData(initialTableData);
      } catch (err) {
        handleError('Error fetching data:', err);
        setColumns([
          {
            ColumnId: 'days',
            Type: 'days',
            Name: 'Day',
            EmojiIcon: '',
            NameVisible: true,
          },
        ]);
        setTableData(DAYS.reduce((acc, day) => ({ ...acc, [day]: {} }), {}));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    const onHeaderChange = (e) => {
      if (e.detail?.layout) setHeaderLayout(e.detail.layout);
    };
    window.addEventListener('header-settings-changed', onHeaderChange);
    return () =>
      window.removeEventListener('header-settings-changed', onHeaderChange);
  }, []);

  const handleAddColumn = useCallback(
    async (type) => {
      try {
        // Створюємо колонку через клас
        const newColumnInstance = createColumn(type);
        const columnJson = newColumnInstance.toJSON();
        
        // Зберігаємо в новому сховищі
        const result = await addColumn(columnJson);
        
        if (result.status) {
          // Конвертуємо для сумісності
          const compatibleColumn = {
            ColumnId: newColumnInstance.id,
            Type: newColumnInstance.type,
            Name: 'New Column',
            EmojiIcon: newColumnInstance.emojiIcon,
            NameVisible: newColumnInstance.nameVisible,
            Width: newColumnInstance.width,
            Description: newColumnInstance.description,
            Chosen: newColumnInstance.days || newColumnInstance.tasks,
            Options: newColumnInstance.options,
            TagColors: newColumnInstance.tagColors,
            CheckboxColor: newColumnInstance.checkboxColor,
            DoneTags: newColumnInstance.doneTags,
            _instance: newColumnInstance
          };
          
          setColumns((prev) => [...prev, compatibleColumn]);
          
          // Оновлюємо порядок
          const newOrder = columns.filter(c => c.ColumnId !== 'days').map(c => c.ColumnId);
          newOrder.push(newColumnInstance.id);
          await updateColumnsOrder(newOrder);
          
          setTableData((prev) => ({
            ...prev,
            ...DAYS.reduce(
              (acc, day) => ({
                ...acc,
                [day]: {
                  ...prev[day],
                  [newColumnInstance.id]: type !== 'tasktable' && type !== 'todo' ? '' : undefined,
                },
              }),
              {}
            ),
          }));
        }
      } catch (err) {
        handleError('Failed to create column:', err);
      }
    },
    [columns, setColumns, setTableData]
  );

  const handleCellChange = useCallback(
    async (day, columnId, value) => {
      const column = columns.find((col) => col.ColumnId === columnId || col._instance?.id === columnId);
      if (!column) return;

      // Окремий обробник для Todo колонок
      if (column.Type === 'todo') {
        if (!column._instance) return;
        
        // Оновлюємо _instance.tasks
        column._instance.tasks = value;
        
        // Зберігаємо в БД
        try {
          await updateColumn(column._instance.toJSON());
          
          // Оновлюємо стан з збереженням _instance та правильним форматом
          setColumns((prev) =>
            prev.map((col) => {
              if (col.ColumnId === columnId || col._instance?.id === columnId) {
                return {
                  ColumnId: column._instance.id,
                  Type: column._instance.type,
                  Name: column._instance.description || 'Column',
                  EmojiIcon: column._instance.emojiIcon,
                  NameVisible: column._instance.nameVisible,
                  Width: column._instance.width,
                  Description: column._instance.description,
                  Chosen: column._instance.tasks,
                  Options: column._instance.options,
                  TagColors: column._instance.tagColors,
                  _instance: column._instance
                };
              }
              return col;
            })
          );
        } catch (err) {
          handleError('Failed to update todo column:', err);
        }
        return;
      }

      // Для TaskTable взагалі не обробляємо тут (є окремий handleChangeOptions)
      if (column.Type === 'tasktable') return;

      // Нормалізуємо значення для чекбокса
      const normalizedValue = column.Type === 'checkbox' ? !!value : value;

      // Тимчасове оновлення для миттєвого відображення
      setTableData((prev) => ({
        ...prev,
        [day]: { ...prev[day], [columnId]: normalizedValue },
      }));

      try {
        // Якщо є екземпляр класу
        if (column._instance && column._instance.days) {
          column._instance.days[day] = normalizedValue;
          await updateColumn(column._instance.toJSON());
          
          const updatedColumn = {
            ...column,
            Chosen: { ...(column.Chosen || {}), [day]: normalizedValue },
            _instance: column._instance // Зберігаємо посилання на оновлений екземпляр
          };
          setColumns((prev) =>
            prev.map((col) => (col.ColumnId === columnId || col._instance?.id === columnId) ? updatedColumn : col)
          );
        } else {
          // Старий формат
          const updatedColumn = {
            ...column,
            Chosen: {
              ...(column.Chosen || {}),
              [day]: normalizedValue,
            },
          };
          
          const columnData = {
            id: column.ColumnId,
            type: column.Type,
            emojiIcon: column.EmojiIcon,
            width: column.Width,
            nameVisible: column.NameVisible,
            description: column.Description,
            days: updatedColumn.Chosen,
            options: column.Options,
            tagColors: column.TagColors,
            checkboxColor: column.CheckboxColor,
          };
          
          await updateColumn(columnData);
          setColumns((prev) =>
            prev.map((col) => (col.ColumnId === columnId) ? updatedColumn : col)
          );
        }
      } catch (err) {
        handleError('Update failed:', err);
        // Відкатуємо до попереднього значення
        setTableData((prev) => ({
          ...prev,
          [day]: { ...prev[day], [columnId]: column._instance?.days?.[day] ?? column.Chosen?.[day] ?? false },
        }));
      }
    },
    [columns, setTableData, setColumns]
  );

  const handleAddTask = useCallback(
    async (columnId, taskText) => {
      const column = columns.find((col) => col.ColumnId === columnId || col._instance?.id === columnId);
      if (!column || column.Type !== 'tasktable') return;

      const updatedOptions = [...(column.Options || []), taskText];
      const updatedTagColors = { ...column.TagColors, [taskText]: 'blue' };
      const updatedColumn = {
        ...column,
        Options: updatedOptions,
        TagColors: updatedTagColors,
      };
      
      try {
        // Якщо є екземпляр класу
        if (column._instance) {
          column._instance.options = updatedOptions;
          column._instance.tagColors = updatedTagColors;
          await updateColumn(column._instance.toJSON());
          
          updatedColumn._instance = column._instance; // Зберігаємо посилання
        } else {
          // Старий формат
          const columnData = {
            id: column.ColumnId,
            type: column.Type,
            emojiIcon: column.EmojiIcon,
            width: column.Width,
            nameVisible: column.NameVisible,
            description: column.Description,
            days: column.Chosen,
            options: updatedOptions,
            tagColors: updatedTagColors,
            checkboxColor: column.CheckboxColor,
            doneTags: column.DoneTags,
          };
          await updateColumn(columnData);
        }
        
        setColumns((prev) =>
          prev.map((col) => (col.ColumnId === columnId || col._instance?.id === columnId) ? updatedColumn : col)
        );
      } catch (err) {
        handleError('Update failed:', err);
      }
    },
    [columns, setColumns]
  );

  const handleMoveColumn = useCallback(
    async (columnId, direction) => {
      const currentIndex = columns.findIndex(
        (col) => col.ColumnId === columnId || col._instance?.id === columnId
      );
      if (
        (direction === 'up' && currentIndex <= 1) ||
        (direction === 'down' && currentIndex === columns.length - 1)
      )
        return;

      const newColumns = [...columns];
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newColumns[currentIndex], newColumns[newIndex]] = [
        newColumns[newIndex],
        newColumns[currentIndex],
      ];
      setColumns(newColumns);
      const newColumnOrder = newColumns
        .filter(col => col.ColumnId !== 'days')
        .map((col) => col._instance?.id || col.ColumnId);
      setColumnOrder(newColumnOrder);

      try {
        await updateColumnsOrder(newColumnOrder);
      } catch (err) {
        handleError('Failed to update column order:', err);
      }
    },
    [columns, setColumns, setColumnOrder]
  );

  const handleChangeWidth = useCallback(
    async (columnId, newWidth) => {
      const width = parseInt(newWidth);
      if (isNaN(width) || width < 50 || width > 1000) {
        handleError(
          'Invalid width value',
          new Error('Width must be between 50 and 1000')
        );
        return;
      }
      const column = columns.find((col) => col.ColumnId === columnId || col._instance?.id === columnId);
      if (!column) return;
      
      const updatedColumn = { ...column, Width: width };
      
      try {
        // Якщо є екземпляр класу
        if (column._instance) {
          column._instance.width = width;
          await updateColumn(column._instance.toJSON());
          
          updatedColumn._instance = column._instance; // Зберігаємо посилання
        } else {
          // Старий формат
          const columnData = {
            id: column.ColumnId,
            type: column.Type,
            emojiIcon: column.EmojiIcon,
            width: width,
            nameVisible: column.NameVisible,
            description: column.Description,
            days: column.Chosen,
            options: column.Options,
            tagColors: column.TagColors,
            checkboxColor: column.CheckboxColor,
            doneTags: column.DoneTags,
          };
          await updateColumn(columnData);
        }
        
        setColumns((prev) =>
          prev.map((col) => (col.ColumnId === columnId || col._instance?.id === columnId) ? updatedColumn : col)
        );
        document
          .querySelectorAll(`[data-column-id="${columnId}"]`)
          .forEach((element) => {
            element.style.width = `${width}px`;
          });
      } catch (err) {
        handleError('Update failed:', err);
      }
    },
    [columns, setColumns]
  );

  const handleChangeOptions = useCallback(
    async (columnId, options, tagColors, doneTags = []) => {
      const column = columns.find((col) => col.ColumnId === columnId || col._instance?.id === columnId);
      if (!column) return;

      const updatedColumn = {
        ...column,
        Options: options,
        TagColors: tagColors,
        DoneTags: doneTags,
      };

      try {
        // Якщо є екземпляр класу
        if (column._instance) {
          column._instance.options = options;
          column._instance.tagColors = tagColors;
          column._instance.doneTags = doneTags;
          await updateColumn(column._instance.toJSON());
          
          updatedColumn._instance = column._instance; // Зберігаємо посилання
        } else {
          // Старий формат
          const columnData = {
            id: column.ColumnId,
            type: column.Type,
            emojiIcon: column.EmojiIcon,
            width: column.Width,
            nameVisible: column.NameVisible,
            description: column.Description,
            days: column.Chosen,
            options: options,
            tagColors: tagColors,
            checkboxColor: column.CheckboxColor,
            doneTags: doneTags,
          };
          await updateColumn(columnData);
        }

        setColumns((prev) =>
          prev.map((col) => (col.ColumnId === columnId || col._instance?.id === columnId) ? updatedColumn : col)
        );
      } catch (err) {
        handleError('Update failed:', err);
      }
    },
    [columns, setColumns]
  );

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
    handleChangeOptions,
  };
};

export const getWidthStyle = (column) => {
  if (column.Type === 'days') return { width: '120px', minWidth: '120px' };
  if (column.Type === 'filler') return { width: 'auto', minWidth: '0px' };
  return { width: `${column.Width}px`, minWidth: `${column.Width}px` };
};

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
  } else if (
    column.Type === 'multi-select' ||
    column.Type === 'multicheckbox'
  ) {
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

  if (column.Type === 'filler') {
    return (
      <td
        key={column.ColumnId}
        data-column-id={column.ColumnId}
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
    }), // Гарантуємо булеве значення
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
      className={`px-2 py-3 text-sm border-border text-textTableRealValues border-r ${column.Type === 'todo' || column.Type === 'tasktable' ? 'todo-cell' : ''}`}
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
