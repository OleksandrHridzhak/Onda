import { useCallback } from 'react';

const electronAPI = window.electronAPI || {
  changeColumn: async () => {},
  deleteComponent: async () => ({ status: false })
};

const handleError = (message, error) => {
  console.error(message, error);
};

// Хук для логіки меню стовпців
export const useColumnMenuLogic = (columns, setColumns) => {
  const updateBackend = useCallback(async (columnId, updates) => {
    const column = columns.find(col => col.ColumnId === columnId);
    if (!column) return { status: 'Column not found' };

    const updatedColumn = { ...column, ...updates };
    try {
      await electronAPI.changeColumn(updatedColumn);
      setColumns(prev => prev.map(col => col.ColumnId === columnId ? updatedColumn : col));
      return { status: 'Success', data: updatedColumn };
    } catch (err) {
      handleError('Update failed:', err);
      setColumns(prev => prev.map(col => col.ColumnId === columnId ? column : col));
      return { status: 'Error', error: err.message };
    }
  }, [columns, setColumns]);

  const handleDeleteColumn = useCallback(async (columnId) => {
    try {
      const result = await electronAPI.deleteComponent(columnId);
      if (result.status) {
        setColumns(prev => prev.filter(col => col.ColumnId !== columnId));
      }
      return result;
    } catch (err) {
      handleError('Failed to delete column:', err);
      return { status: 'Error', error: err.message };
    }
  }, [setColumns]);

  const handleRename = useCallback((columnId, newName) => {
    return updateBackend(columnId, { Name: newName });
  }, [updateBackend]);

  const handleChangeIcon = useCallback((columnId, newIcon) => {
    return updateBackend(columnId, { EmojiIcon: newIcon });
  }, [updateBackend]);

  const handleChangeDescription = useCallback((columnId, newDescription) => {
    return updateBackend(columnId, { Description: newDescription });
  }, [updateBackend]);

  const handleToggleTitleVisibility = useCallback((columnId, showTitle) => {
    return updateBackend(columnId, { NameVisible: showTitle });
  }, [updateBackend]);

  const handleChangeOptions = useCallback((columnId, options, tagColors, doneTags = []) => {
    return updateBackend(columnId, { Options: options, TagColors: tagColors, DoneTags: doneTags });
  }, [updateBackend]);

  const handleChangeCheckboxColor = useCallback((columnId, color) => {
    return updateBackend(columnId, { CheckboxColor: color });
  }, [updateBackend]);

  return {
    handleDeleteColumn,
    handleRename,
    handleChangeIcon,
    handleChangeDescription,
    handleToggleTitleVisibility,
    handleChangeOptions,
    handleChangeCheckboxColor
  };
};