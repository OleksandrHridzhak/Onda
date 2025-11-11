import { useCallback } from 'react';
import { addColumn, updateColumnsOrder } from '../../../services/columnsDB';
import { createColumn } from '../../../models/columns/index';
import { instanceToLegacy } from '../../../models/columns/columnAdapter';
import { useColumnOperations } from './useColumnOperations';
import { DAYS } from './useColumnsData';

const handleError = (message, error) => {
  console.error(message, error);
};

/**
 * Хук для обробників операцій таблиці
 */
export const useTableHandlers = (columns, setColumns, tableData, setTableData, setColumnOrder) => {
  const { updateDayData, updateTasks, updateProperties } = useColumnOperations(columns, setColumns);

  /**
   * Додає нову колонку
   */
  const handleAddColumn = useCallback(
    async (type) => {
      try {
        const newColumnInstance = createColumn(type);
        const columnJson = newColumnInstance.toJSON();
        
        const result = await addColumn(columnJson);
        
        if (result.status) {
          const compatibleColumn = instanceToLegacy(newColumnInstance);
          compatibleColumn.Name = 'New Column';
          
          setColumns((prev) => [...prev, compatibleColumn]);
          
          // Оновлюємо порядок колонок
          const newOrder = columns.filter(c => c.ColumnId !== 'days').map(c => c.ColumnId);
          newOrder.push(newColumnInstance.id);
          await updateColumnsOrder(newOrder);
          
          // Додаємо порожні дані для нових днів (крім todo/tasktable)
          if (type !== 'tasktable' && type !== 'todo') {
            setTableData((prev) => ({
              ...prev,
              ...DAYS.reduce(
                (acc, day) => ({
                  ...acc,
                  [day]: {
                    ...prev[day],
                    [newColumnInstance.id]: '',
                  },
                }),
                {}
              ),
            }));
          }
        }
      } catch (err) {
        handleError('Failed to create column:', err);
      }
    },
    [columns, setColumns, setTableData]
  );

  /**
   * Обробляє зміну даних в клітинці
   */
  const handleCellChange = useCallback(
    async (day, columnId, value) => {
      const column = columns.find((col) => col.ColumnId === columnId || col._instance?.id === columnId);
      if (!column) return;

      // Todo колонки
      if (column.Type === 'todo') {
        await updateTasks(columnId, value);
        return;
      }

      // TaskTable - не обробляємо (є окремий handleChangeOptions)
      if (column.Type === 'tasktable') return;

      // Нормалізуємо значення для чекбокса
      const normalizedValue = column.Type === 'checkbox' ? !!value : value;

      // Миттєве оновлення UI
      setTableData((prev) => ({
        ...prev,
        [day]: { ...prev[day], [columnId]: normalizedValue },
      }));

      // Зберігаємо в БД
      try {
        await updateDayData(columnId, day, normalizedValue);
      } catch (err) {
        handleError('Update failed:', err);
        // Відкат
        const oldValue = column._instance?.days?.[day] ?? column.Chosen?.[day] ?? false;
        setTableData((prev) => ({
          ...prev,
          [day]: { ...prev[day], [columnId]: oldValue },
        }));
      }
    },
    [columns, setTableData, updateDayData, updateTasks]
  );

  /**
   * Додає завдання в TaskTable
   */
  const handleAddTask = useCallback(
    async (columnId, taskText) => {
      const column = columns.find((col) => col.ColumnId === columnId || col._instance?.id === columnId);
      if (!column || column.Type !== 'tasktable') return;

      const updatedOptions = [...(column.Options || []), taskText];
      const updatedTagColors = { ...column.TagColors, [taskText]: 'blue' };

      await updateProperties(columnId, {
        Options: updatedOptions,
        TagColors: updatedTagColors,
      });
    },
    [columns, updateProperties]
  );

  /**
   * Переміщує колонку вгору/вниз
   */
  const handleMoveColumn = useCallback(
    async (columnId, direction) => {
      const currentIndex = columns.findIndex(
        (col) => col.ColumnId === columnId || col._instance?.id === columnId
      );
      
      if (
        (direction === 'up' && currentIndex <= 1) ||
        (direction === 'down' && currentIndex === columns.length - 1)
      ) {
        return;
      }

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

  /**
   * Змінює ширину колонки
   */
  const handleChangeWidth = useCallback(
    async (columnId, newWidth) => {
      const width = parseInt(newWidth);
      if (isNaN(width) || width < 50 || width > 1000) {
        handleError('Invalid width value', new Error('Width must be between 50 and 1000'));
        return;
      }

      await updateProperties(columnId, { Width: width });

      // Оновлюємо CSS
      document.querySelectorAll(`[data-column-id="${columnId}"]`).forEach((element) => {
        element.style.width = `${width}px`;
      });
    },
    [updateProperties]
  );

  /**
   * Змінює options для multi-select, multicheckbox, tasktable
   */
  const handleChangeOptions = useCallback(
    async (columnId, options, tagColors, doneTags = []) => {
      await updateProperties(columnId, {
        Options: options,
        TagColors: tagColors,
        DoneTags: doneTags,
      });
    },
    [updateProperties]
  );

  return {
    handleAddColumn,
    handleCellChange,
    handleAddTask,
    handleMoveColumn,
    handleChangeWidth,
    handleChangeOptions,
  };
};
