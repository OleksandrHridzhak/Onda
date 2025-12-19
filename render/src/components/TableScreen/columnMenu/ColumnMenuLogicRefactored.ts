import { useCallback } from 'react';
import { deleteColumn, updateColumn } from '../../../services/columnsDB';

interface Column {
  id: string;
  type?: string;
  name?: string;
  options?: string[];
  tagColors?: Record<string, string>;
  doneTags?: string[];
  toJSON: () => unknown;
  setEmojiIcon?: (icon: string) => void;
  setDescription?: (description: string) => void;
  setNameVisible?: (visible: boolean) => void;
  setCheckboxColor?: (color: string) => void;
  [key: string]: unknown;
}

interface UpdateResult {
  status: string;
  data?: Column;
  error?: string;
}

/**
 * Хук для логіки меню колонок
 * Спрощена версія - використовує методи класів замість ручного маніпулювання об'єктами
 */
export const useColumnMenuLogic = (
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
) => {
  // Загальна функція оновлення колонки
  const updateColumnInstance = useCallback(
    async (
      columnId: string,
      updateFn: (column: Column) => void,
    ): Promise<UpdateResult> => {
      let updatedColumn: Column | undefined;

      setColumns((prev) => {
        const column = prev.find((col) => col.id === columnId);
        if (!column) return prev;

        // Викликаємо функцію оновлення (використовує методи класу)
        updateFn(column);
        updatedColumn = column;

        return prev.map((col) => (col.id === columnId ? column : col));
      });

      try {
        if (!updatedColumn) {
          return { status: 'Error', error: 'Column not found' };
        }
        await updateColumn(updatedColumn.toJSON());
        return { status: 'Success', data: updatedColumn };
      } catch (err) {
        console.error('Update failed:', err);
        // Відкат через повторне завантаження
        setColumns((prev) => [...prev]);
        return { status: 'Error', error: (err as Error).message };
      }
    },
    [setColumns],
  );

  // Видалення колонки
  const handleDeleteColumn = useCallback(
    async (columnId: string): Promise<UpdateResult> => {
      try {
        const result = await deleteColumn(columnId);
        if (result.status) {
          setColumns((prev) => prev.filter((col) => col.id !== columnId));
        }
        return result;
      } catch (err) {
        console.error('Failed to delete column:', err);
        return { status: 'Error', error: (err as Error).message };
      }
    },
    [setColumns],
  );

  // Перейменування - використовує метод update() базового класу
  const handleRename = useCallback(
    async (columnId: string, newName: string): Promise<UpdateResult> => {
      return await updateColumnInstance(columnId, (column) => {
        column.name = newName;
      });
    },
    [updateColumnInstance],
  );

  // Зміна іконки
  const handleChangeIcon = useCallback(
    (columnId: string, newIcon: string): Promise<UpdateResult> => {
      return updateColumnInstance(columnId, (column) => {
        if (column.setEmojiIcon) {
          column.setEmojiIcon(newIcon);
        }
      });
    },
    [updateColumnInstance],
  );

  // Зміна опису
  const handleChangeDescription = useCallback(
    async (columnId: string, newDescription: string): Promise<UpdateResult> => {
      return await updateColumnInstance(columnId, (column) => {
        if (column.setDescription) {
          column.setDescription(newDescription);
        }
      });
    },
    [updateColumnInstance],
  );

  // Перемикання видимості заголовку
  const handleToggleTitleVisibility = useCallback(
    (columnId: string, showTitle: boolean): Promise<UpdateResult> => {
      return updateColumnInstance(columnId, (column) => {
        if (column.setNameVisible) {
          column.setNameVisible(showTitle);
        }
      });
    },
    [updateColumnInstance],
  );

  // Зміна опцій (для колонок з options)
  const handleChangeOptions = useCallback(
    (
      columnId: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags: string[] = [],
    ): Promise<UpdateResult> => {
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
    [updateColumnInstance],
  );

  // Зміна кольору чекбоксу
  const handleChangeCheckboxColor = useCallback(
    (columnId: string, color: string): Promise<UpdateResult> => {
      return updateColumnInstance(columnId, (column) => {
        if (column.setCheckboxColor) {
          column.setCheckboxColor(color);
        }
      });
    },
    [updateColumnInstance],
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
