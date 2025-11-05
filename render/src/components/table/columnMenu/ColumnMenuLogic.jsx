import { useCallback } from 'react';
import { deleteColumn } from '../../../services/columnsDB';
import { useColumnOperations } from '../hooks/useColumnOperations';

const handleError = (message, error) => {
  console.error(message, error);
};

/**
 * Хук для логіки меню колонок
 * Забезпечує операції оновлення, видалення та модифікації колонок
 */
export const useColumnMenuLogic = (columns, setColumns) => {
  const { updateProperties } = useColumnOperations(columns, setColumns);

  const handleDeleteColumn = useCallback(
    async (columnId) => {
      try {
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
      return await updateProperties(columnId, { Name: newName });
    },
    [updateProperties]
  );

  const handleChangeIcon = useCallback(
    (columnId, newIcon) => {
      return updateProperties(columnId, { EmojiIcon: newIcon });
    },
    [updateProperties]
  );

  const handleChangeDescription = useCallback(
    async (columnId, newDescription) => {
      return await updateProperties(columnId, { Description: newDescription });
    },
    [updateProperties]
  );

  const handleToggleTitleVisibility = useCallback(
    (columnId, showTitle) => {
      return updateProperties(columnId, { NameVisible: showTitle });
    },
    [updateProperties]
  );

  const handleChangeOptions = useCallback(
    (columnId, options, tagColors, doneTags = []) => {
      return updateProperties(columnId, {
        Options: options,
        TagColors: tagColors,
        DoneTags: doneTags,
      });
    },
    [updateProperties]
  );

  const handleChangeCheckboxColor = useCallback(
    (columnId, color) => {
      return updateProperties(columnId, { CheckboxColor: color });
    },
    [updateProperties]
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
