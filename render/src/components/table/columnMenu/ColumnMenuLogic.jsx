import { useCallback } from 'react';
import { deleteColumn, updateColumn } from '../../../services/columnsDB';

const handleError = (message, error) => {
  console.error(message, error);
};

// Хук для логіки меню стовпців
export const useColumnMenuLogic = (columns, setColumns) => {
  const updateBackend = useCallback(
    async (columnId, updates) => {
      let updatedColumn;
      setColumns((prev) => {
        const original = prev.find((col) => col.ColumnId === columnId || col._instance?.id === columnId);
        if (!original) return prev;
        updatedColumn = { ...original, ...updates };
        return prev.map((col) =>
          (col.ColumnId === columnId || col._instance?.id === columnId) ? updatedColumn : col
        );
      });

      try {
        // Якщо є екземпляр класу - використовуємо його
        if (updatedColumn._instance) {
          // Оновлюємо поля в екземплярі
          if (updates.Name !== undefined) updatedColumn._instance.description = updates.Name;
          if (updates.EmojiIcon !== undefined) updatedColumn._instance.emojiIcon = updates.EmojiIcon;
          if (updates.Width !== undefined) updatedColumn._instance.width = updates.Width;
          if (updates.NameVisible !== undefined) updatedColumn._instance.nameVisible = updates.NameVisible;
          if (updates.Description !== undefined) updatedColumn._instance.description = updates.Description;
          if (updates.CheckboxColor !== undefined) updatedColumn._instance.checkboxColor = updates.CheckboxColor;
          if (updates.Options !== undefined) updatedColumn._instance.options = updates.Options;
          if (updates.TagColors !== undefined) updatedColumn._instance.tagColors = updates.TagColors;
          if (updates.DoneTags !== undefined) updatedColumn._instance.doneTags = updates.DoneTags;
          
          await updateColumn(updatedColumn._instance.toJSON());
          
          // Переконуємося що посилання зберігається
          updatedColumn = { ...updatedColumn, _instance: updatedColumn._instance };
        } else {
          // Старий формат - конвертуємо
          const columnData = {
            id: updatedColumn.ColumnId,
            type: updatedColumn.Type,
            emojiIcon: updatedColumn.EmojiIcon,
            width: updatedColumn.Width,
            nameVisible: updatedColumn.NameVisible,
            description: updatedColumn.Description,
            days: updatedColumn.Chosen,
            options: updatedColumn.Options,
            tagColors: updatedColumn.TagColors,
            checkboxColor: updatedColumn.CheckboxColor,
            doneTags: updatedColumn.DoneTags,
          };
          await updateColumn(columnData);
        }
        return { status: 'Success', data: updatedColumn };
      } catch (err) {
        handleError('Update failed:', err);
        // Откат
        setColumns((prev) =>
          prev.map((col) =>
            (col.ColumnId === columnId || col._instance?.id === columnId) ? { ...col, ...updates } : col
          )
        );
        return { status: 'Error', error: err.message };
      }
    },
    [setColumns]
  );

  const handleDeleteColumn = useCallback(
    async (columnId) => {
      try {
        // Знаходимо колонку
        const column = columns.find(col => col.ColumnId === columnId || col._instance?.id === columnId);
        const actualId = column?._instance?.id || columnId;
        
        const result = await deleteColumn(actualId);
        if (result.status || result.status === 'Column deleted') {
          setColumns((prev) => prev.filter((col) => 
            col.ColumnId !== columnId && col._instance?.id !== actualId
          ));
        }
        return result;
      } catch (err) {
        handleError('Failed to delete column:', err);
        return { status: 'Error', error: err.message };
      }
    },
    [columns, setColumns]
  );

  const handleRename = useCallback(
    async (columnId, newName) => {
      return await updateBackend(columnId, { Name: newName });
    },
    [updateBackend]
  );

  const handleChangeIcon = useCallback(
    (columnId, newIcon) => {
      return updateBackend(columnId, { EmojiIcon: newIcon });
    },
    [updateBackend]
  );

  const handleChangeDescription = useCallback(
    async (columnId, newDescription) => {
      return await updateBackend(columnId, { Description: newDescription });
    },
    [updateBackend]
  );

  const handleToggleTitleVisibility = useCallback(
    (columnId, showTitle) => {
      return updateBackend(columnId, { NameVisible: showTitle });
    },
    [updateBackend]
  );

  const handleChangeOptions = useCallback(
    (columnId, options, tagColors, doneTags = []) => {
      return updateBackend(columnId, {
        Options: options,
        TagColors: tagColors,
        DoneTags: doneTags,
      });
    },
    [updateBackend]
  );

  const handleChangeCheckboxColor = useCallback(
    (columnId, color) => {
      return updateBackend(columnId, { CheckboxColor: color });
    },
    [updateBackend]
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
