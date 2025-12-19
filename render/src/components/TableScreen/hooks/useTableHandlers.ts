import { useCallback } from 'react';
import { addColumn, updateColumnsOrder } from '../../../services/columnsDB';
import { createColumn } from '../../../models/columns/index';
import { useColumnOperations } from './useColumnOperations';
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
  const { updateDayData, updateTasks, updateProperties } = useColumnOperations(
    columns,
    setColumns,
  );

  /**
   * Додає нову колонку
   */
  const handleAddColumn = useCallback(
    async (type: string): Promise<void> => {
      try {
        const newColumnInstance = createColumn(type);
        const columnJson = newColumnInstance.toJSON();

        const result = await addColumn(columnJson);

        if (result.status) {
          // Використовуємо екземпляр напряму
          newColumnInstance.name = 'New Column';

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
      const column = columns.find((col) => col.id === columnId);
      if (!column) return;

      // Todo колонки
      if (column.type === 'todo') {
        await updateTasks(columnId, value);
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

      // Зберігаємо в БД
      try {
        await updateDayData(columnId, day, normalizedValue);
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
    [columns, setTableData, updateDayData, updateTasks],
  );

  /**
   * Додає завдання в TaskTable
   */
  const handleAddTask = useCallback(
    async (columnId: string, taskText: string): Promise<void> => {
      const column = columns.find((col) => col.id === columnId);
      if (!column || column.type !== 'tasktable') return;

      const taskCol = column as any;
      const updatedOptions = [...(taskCol.options || []), taskText];
      const updatedTagColors = { ...taskCol.tagColors, [taskText]: 'blue' };

      await updateProperties(columnId, {
        Options: updatedOptions,
        TagColors: updatedTagColors,
      });
    },
    [columns, updateProperties],
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

      await updateProperties(columnId, { Width: width });

      // Оновлюємо CSS
      document
        .querySelectorAll(`[data-column-id="${columnId}"]`)
        .forEach((element) => {
          (element as HTMLElement).style.width = `${width}px`;
        });
    },
    [updateProperties],
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
      await updateProperties(columnId, {
        Options: options,
        TagColors: tagColors,
        DoneTags: doneTags,
      });
    },
    [updateProperties],
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
