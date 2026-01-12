import { useCallback } from 'react';
import { updateColumn } from '../../../../services/indexedDB/columnsDB';
import { ColumnData } from '../../../../types/column.types';

const handleError = (message: string, error: unknown): void => {
  console.error(message, error);
};

type Column = ColumnData;

interface UpdateResult {
  status: string;
  data?: Column;
  error?: string;
}

/**
 * Хук для операцій оновлення колонок
 */
export const useColumnOperations = (
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
) => {
  /**
   * Оновлює колонку в БД та стані
   */
  const updateColumnData = useCallback(
    async (
      columnId: string,
      updateFn: (column: Column) => void,
    ): Promise<UpdateResult> => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) {
        console.warn('Column not found:', columnId);
        return { status: 'Error', error: 'Column not found' };
      }

      try {
        // Створюємо копію колонки та оновлюємо
        const updatedColumn = { ...column };
        updateFn(updatedColumn);
        await updateColumn(updatedColumn);

        // Оновлюємо стан
        setColumns((prev) =>
          prev.map((col) => (col.id === columnId ? updatedColumn : col)),
        );

        return { status: 'Success', data: updatedColumn };
      } catch (err) {
        handleError('Failed to update column:', err);
        return { status: 'Error', error: (err as Error).message };
      }
    },
    [columns, setColumns],
  );

  /**
   * Оновлює день-специфічні дані (для DayBasedColumn)
   */
  const updateDayData = useCallback(
    async (
      columnId: string,
      day: string,
      value: unknown,
    ): Promise<UpdateResult> => {
      return updateColumnData(columnId, (instance) => {
        if ('days' in instance && instance.days) {
          instance.days[day] = value;
        }
      });
    },
    [updateColumnData],
  );

  /**
   * Оновлює tasks (для TodoColumn)
   */
  const updateTasks = useCallback(
    async (columnId: string, tasks: unknown): Promise<UpdateResult> => {
      return updateColumnData(columnId, (instance) => {
        if ('tasks' in instance) {
          (instance as any).tasks = tasks;
        }
      });
    },
    [updateColumnData],
  );

  /**
   * Оновлює базові властивості колонки
   */
  const updateProperties = useCallback(
    async (
      columnId: string,
      updates: Record<string, unknown>,
    ): Promise<UpdateResult> => {
      return updateColumnData(columnId, (instance) => {
        // Мапінг legacy полів на поля класу для зворотної сумісності
        const fieldMapping: Record<string, string> = {
          Name: 'name',
          EmojiIcon: 'emojiIcon',
          Width: 'width',
          NameVisible: 'nameVisible',
          Description: 'description',
          CheckboxColor: 'checkboxColor',
          Options: 'options',
          TagColors: 'tagColors',
          DoneTags: 'doneTags',
        };

        Object.entries(updates).forEach(([key, value]) => {
          // Перевіряємо чи це legacy ключ
          const instanceKey = fieldMapping[key] || key;
          if (value !== undefined) {
            instance[instanceKey] = value;
          }
        });
      });
    },
    [updateColumnData],
  );

  /**
   * Очищує дані колонки (знімає галочки, видаляє виконані todo, тощо)
   */
  const clearColumn = useCallback(
    async (columnId: string): Promise<UpdateResult> => {
      console.log('clearColumn called with columnId:', columnId);
      return updateColumnData(columnId, (instance) => {
        console.log(
          'clearColumn - instance type:',
          instance.type,
          'instance:',
          instance,
        );

        if (instance.type === 'tasktable' && 'doneTags' in instance) {
          // TaskTableColumn - повертаємо виконані назад у невиконані (перевіряємо ПЕРШИМ!)
          const taskCol = instance as any;
          console.log('Clearing TaskTable - BEFORE:', {
            options: [...(taskCol.options || [])],
            doneTags: [...(taskCol.doneTags || [])],
          });
          if (taskCol.doneTags && taskCol.doneTags.length > 0) {
            taskCol.options = [...(taskCol.options || []), ...taskCol.doneTags];
            taskCol.doneTags = [];
          }
          console.log('Clearing TaskTable - AFTER:', {
            options: [...(taskCol.options || [])],
            doneTags: [...(taskCol.doneTags || [])],
          });
        } else if ('days' in instance) {
          // DayBasedColumn (checkbox, numberbox, text, multiselect, multicheckbox)
          console.log('Clearing days for DayBasedColumn');
          const dayCol = instance as any;
          Object.keys(dayCol.days).forEach((day) => {
            dayCol.days[day] = '';
          });
        } else if ('tasks' in instance) {
          // TodoColumn - видаляємо тільки виконані
          console.log('Clearing completed tasks for TodoColumn');
          const todoCol = instance as any;
          todoCol.tasks = (
            todoCol.tasks as Array<{ completed: boolean }>
          ).filter((task) => !task.completed);
        }
      });
    },
    [updateColumnData],
  );

  return {
    updateColumnData,
    updateDayData,
    updateTasks,
    updateProperties,
    clearColumn,
  };
};
