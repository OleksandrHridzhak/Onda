import { useCallback } from 'react';
import { deleteColumn, updateColumn } from '../../../services/columnsDB';

/**
 * Хук для логіки меню колонок
 * Спрощена версія - використовує методи класів замість ручного маніпулювання об'єктами
 */
export const useColumnMenuLogic = (columns, setColumns) => {
  // Загальна функція оновлення колонки
  const updateColumnInstance = useCallback(
    async (columnId, updateFn) => {
      let updatedColumn;

      setColumns((prev) => {
        const column = prev.find((col) => col.id === columnId);
        if (!column) return prev;

        // Викликаємо функцію оновлення (використовує методи класу)
        updateFn(column);
        updatedColumn = column;

        return prev.map((col) => (col.id === columnId ? column : col));
      });

      try {
        await updateColumn(updatedColumn.toJSON());
        return { status: 'Success', data: updatedColumn };
      } catch (err) {
        console.error('Update failed:', err);
        // Відкат через повторне завантаження
        setColumns((prev) => [...prev]);
        return { status: 'Error', error: err.message };
      }
    },
    [setColumns]
  );

  // Видалення колонки
  const handleDeleteColumn = useCallback(
    async (columnId) => {
      try {
        const result = await deleteColumn(columnId);
        if (result.status) {
          setColumns((prev) => prev.filter((col) => col.id !== columnId));
        }
        return result;
      } catch (err) {
        console.error('Failed to delete column:', err);
        return { status: 'Error', error: err.message };
      }
    },
    [setColumns]
  );

  // Перейменування - використовує метод update() базового класу
  const handleRename = useCallback(
    async (columnId, newName) => {
      return await updateColumnInstance(columnId, (column) => {
        column.name = newName;
      });
    },
    [updateColumnInstance]
  );

  // Зміна іконки
  const handleChangeIcon = useCallback(
    (columnId, newIcon) => {
      return updateColumnInstance(columnId, (column) => {
        column.setEmojiIcon(newIcon);
      });
    },
    [updateColumnInstance]
  );

  // Зміна опису
  const handleChangeDescription = useCallback(
    async (columnId, newDescription) => {
      return await updateColumnInstance(columnId, (column) => {
        column.setDescription(newDescription);
      });
    },
    [updateColumnInstance]
  );

  // Перемикання видимості заголовку
  const handleToggleTitleVisibility = useCallback(
    (columnId, showTitle) => {
      return updateColumnInstance(columnId, (column) => {
        column.setNameVisible(showTitle);
      });
    },
    [updateColumnInstance]
  );

  // Зміна опцій (для колонок з options)
  const handleChangeOptions = useCallback(
    (columnId, options, tagColors, doneTags = []) => {
      return updateColumnInstance(columnId, (column) => {
        // Перевірка чи є методи для роботи з опціями
        if (column.options !== undefined) {
          column.options = options;
          column.tagColors = tagColors;
        }
        if (column.doneTags !== undefined) {
          column.doneTags = doneTags;
        }
      });
    },
    [updateColumnInstance]
  );

  // Зміна кольору чекбоксу
  const handleChangeCheckboxColor = useCallback(
    (columnId, color) => {
      return updateColumnInstance(columnId, (column) => {
        if (column.setCheckboxColor) {
          column.setCheckboxColor(color);
        }
      });
    },
    [updateColumnInstance]
  );

  return {
    handleDeleteColumn,
    handleRename,
    handleChangeIcon,
    handleChangeDescription,
    handleToggleTitleVisibility,
    handleChangeOptions,
    handleChangeCheckboxColor,
  };
};
