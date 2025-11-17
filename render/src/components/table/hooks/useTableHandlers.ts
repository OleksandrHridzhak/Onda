import { useCallback } from 'react';
import { updateColumnsOrder } from '../../../services/columnsDB';
import { createColumn } from '../../../models/columns/index';
import { DAYS } from './useColumnsData';
import { BaseColumn } from '../../../models/columns/BaseColumn';

const handleError = (message: string, error: unknown): void => {
  console.error(message, error);
};

type Column = BaseColumn;

/**
 * Хук для обробників операцій таблиці
 */
export const useTableHandlers = (
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  tableData: Record<string, Record<string, unknown>>,
  setTableData: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, unknown>>>
  >,
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  /**
   * Додає нову колонку
   */
  const handleAddColumn = useCallback(
    async (type: string): Promise<void> => {
      try {
        const newColumnInstance = createColumn(type);
        newColumnInstance.name = 'New Column';

        // Use column's own save method
        await newColumnInstance.save();

        setColumns((prev) => [...prev, newColumnInstance]);

        // Оновлюємо порядок колонок
        const newOrder = columns
          .filter((c) => c.id !== 'days')
          .map((c) => c.id);
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
              {},
            ),
          }));
        }
      } catch (err) {
        handleError('Failed to create column:', err);
      }
    },
    [columns, setColumns, setTableData],
  );

  /**
   * Обробляє зміну даних в клітинці
   */
  const handleCellChange = useCallback(
    async (day: string, columnId: string, value: unknown): Promise<void> => {
      const column = columns.find((col) => col.id === columnId) as any;
      if (!column) return;

      // Todo колонки
      if (column.type === 'todo') {
        await column.updateTasks(value);
        setColumns((prev) => [...prev]); // Trigger re-render
        return;
      }

      // TaskTable - не обробляємо (є окремий handleChangeOptions)
      if (column.type === 'tasktable') return;

      // Нормалізуємо значення для чекбокса
      const normalizedValue = column.type === 'checkbox' ? !!value : value;

      // Миттєве оновлення UI
      setTableData((prev) => ({
        ...prev,
        [day]: { ...prev[day], [columnId]: normalizedValue },
      }));

      // Зберігаємо в БД через метод колонки
      try {
        if ('setDayValue' in column) {
          await column.setDayValue(day, normalizedValue);
        }
      } catch (err) {
        handleError('Update failed:', err);
        // Відкат
        const oldValue =
          'days' in column && column.days ? (column.days as any)[day] : false;
        setTableData((prev) => ({
          ...prev,
          [day]: { ...prev[day], [columnId]: oldValue },
        }));
      }
    },
    [columns, setTableData, setColumns],
  );

  /**
   * Додає завдання в TaskTable
   */
  const handleAddTask = useCallback(
    async (columnId: string, taskText: string): Promise<void> => {
      const column = columns.find((col) => col.id === columnId) as any;
      if (!column || column.type !== 'tasktable') return;

      // Use column's own addTask method
      await column.addTask(taskText, 'blue');
      setColumns((prev) => [...prev]); // Trigger re-render
    },
    [columns, setColumns],
  );

  /**
   * Переміщує колонку вгору/вниз
   */
  const handleMoveColumn = useCallback(
    async (columnId: string, direction: 'up' | 'down'): Promise<void> => {
      const currentIndex = columns.findIndex((col) => col.id === columnId);

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
        .filter((col) => col.id !== 'days')
        .map((col) => col.id);
      setColumnOrder(newColumnOrder);

      try {
        await updateColumnsOrder(newColumnOrder);
      } catch (err) {
        handleError('Failed to update column order:', err);
      }
    },
    [columns, setColumns, setColumnOrder],
  );

  /**
   * Змінює ширину колонки
   */
  const handleChangeWidth = useCallback(
    async (columnId: string, newWidth: number | string): Promise<void> => {
      const width =
        typeof newWidth === 'string' ? parseInt(newWidth) : newWidth;
      if (isNaN(width) || width < 50 || width > 1000) {
        handleError(
          'Invalid width value',
          new Error('Width must be between 50 and 1000'),
        );
        return;
      }

      const column = columns.find((col) => col.id === columnId);
      if (!column) return;

      // Use column's own setWidth method
      await column.setWidth(width);
      setColumns((prev) => [...prev]); // Trigger re-render

      // Оновлюємо CSS
      document
        .querySelectorAll(`[data-column-id="${columnId}"]`)
        .forEach((element) => {
          (element as HTMLElement).style.width = `${width}px`;
        });
    },
    [columns, setColumns],
  );

  /**
   * Змінює options для multi-select, multicheckbox, tasktable
   */
  const handleChangeOptions = useCallback(
    async (
      columnId: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags: string[] = [],
    ): Promise<void> => {
      const column = columns.find((col) => col.id === columnId) as any;
      if (!column) return;

      // Use column's own updateOptions method if available
      if ('updateOptions' in column) {
        if (column.type === 'tasktable' && 'updateOptionsAndTags' in column) {
          await column.updateOptionsAndTags(options, tagColors, doneTags);
        } else {
          await column.updateOptions(options, tagColors);
        }
      } else {
        // Fallback for columns without updateOptions
        column.options = options;
        column.tagColors = tagColors;
        if ('doneTags' in column) {
          column.doneTags = doneTags;
        }
        await column.save();
      }

      setColumns((prev) => [...prev]); // Trigger re-render
    },
    [columns, setColumns],
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
