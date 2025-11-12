import { useCallback } from 'react';
import { updateColumn } from '../../../services/columnsDB';

const handleError = (message, error) => {
  console.error(message, error);
};

/**
 * Хук для операцій оновлення колонок
 */
export const useColumnOperations = (columns, setColumns) => {
  
  /**
   * Оновлює колонку в БД та стані
   */
  const updateColumnData = useCallback(
    async (columnId, updateFn) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) {
        console.warn('Column not found:', columnId);
        return { status: 'Error', error: 'Column not found' };
      }

      try {
        // Викликаємо функцію оновлення на екземплярі
        updateFn(column);
        await updateColumn(column.toJSON());
        
        // Оновлюємо стан
        setColumns((prev) =>
          prev.map((col) => 
            col.id === columnId ? column : col
          )
        );
        
        return { status: 'Success', data: column };
      } catch (err) {
        handleError('Failed to update column:', err);
        return { status: 'Error', error: err.message };
      }
    },
    [columns, setColumns]
  );

  /**
   * Оновлює день-специфічні дані (для DayBasedColumn)
   */
  const updateDayData = useCallback(
    async (columnId, day, value) => {
      return updateColumnData(columnId, (instance) => {
        if (instance.days) {
          instance.days[day] = value;
        }
      });
    },
    [updateColumnData]
  );

  /**
   * Оновлює tasks (для TodoColumn)
   */
  const updateTasks = useCallback(
    async (columnId, tasks) => {
      return updateColumnData(columnId, (instance) => {
        instance.tasks = tasks;
      });
    },
    [updateColumnData]
  );

  /**
   * Оновлює базові властивості колонки
   */
  const updateProperties = useCallback(
    async (columnId, updates) => {
      return updateColumnData(columnId, (instance) => {
        // Мапінг legacy полів на поля класу для зворотної сумісності
        const fieldMapping = {
          Name: 'name',
          EmojiIcon: 'emojiIcon',
          Width: 'width',
          NameVisible: 'nameVisible',
          Description: 'description',
          CheckboxColor: 'checkboxColor',
          Options: 'options',
          TagColors: 'tagColors',
          DoneTags: 'doneTags'
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
    [updateColumnData]
  );

  /**
   * Очищує дані колонки (знімає галочки, видаляє виконані todo, тощо)
   */
  const clearColumn = useCallback(
    async (columnId) => {
      console.log('clearColumn called with columnId:', columnId);
      return updateColumnData(columnId, (instance) => {
        console.log('clearColumn - instance type:', instance.type, 'instance:', instance);
        
        if (instance.type === 'tasktable' && instance.doneTags !== undefined) {
          // TaskTableColumn - повертаємо виконані назад у невиконані (перевіряємо ПЕРШИМ!)
          console.log('Clearing TaskTable - BEFORE:', {
            options: [...instance.options],
            doneTags: [...instance.doneTags]
          });
          if (instance.doneTags && instance.doneTags.length > 0) {
            instance.options = [...(instance.options || []), ...instance.doneTags];
            instance.doneTags = [];
          }
          console.log('Clearing TaskTable - AFTER:', {
            options: [...instance.options],
            doneTags: [...instance.doneTags]
          });
        } else if (instance.days) {
          // DayBasedColumn (checkbox, numberbox, text, multi-select, multicheckbox)
          console.log('Clearing days for DayBasedColumn');
          Object.keys(instance.days).forEach(day => {
            instance.days[day] = '';
          });
        } else if (instance.tasks !== undefined) {
          // TodoColumn - видаляємо тільки виконані
          console.log('Clearing completed tasks for TodoColumn');
          instance.tasks = instance.tasks.filter(task => !task.completed);
        }
      });
    },
    [updateColumnData]
  );

  return {
    updateColumnData,
    updateDayData,
    updateTasks,
    updateProperties,
    clearColumn,
  };
};
