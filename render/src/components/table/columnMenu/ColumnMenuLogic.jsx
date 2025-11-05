import { useCallback } from 'react';
import { deleteColumn } from '../../../services/columnsDB';
import { useColumnOperations } from '../hooks/useColumnOperations';
import { DAYS } from '../hooks/useColumnsData';

const handleError = (message, error) => {
  console.error(message, error);
};

/**
 * Хук для логіки меню колонок
 * Забезпечує операції оновлення, видалення та модифікації колонок
 */
export const useColumnMenuLogic = (columns, setColumns, setTableData) => {
  const { updateProperties, clearColumn } = useColumnOperations(columns, setColumns);

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

  const handleClearColumn = useCallback(
    async (columnId) => {
      console.log('handleClearColumn called for:', columnId);
      
      // Clear column data in database and update columns state
      const result = await clearColumn(columnId);
      console.log('clearColumn result:', result);
      
      // For DayBasedColumn types, also clear tableData
      const column = columns.find(col => col.ColumnId === columnId);
      console.log('Found column:', column);
      
      if (column && column.Type !== 'todo' && column.Type !== 'tasktable') {
        console.log('Clearing tableData for DayBasedColumn');
        // Clear tableData for DayBasedColumns (checkbox, multicheckbox, number, notes, tags, multiselect)
        setTableData(prev => {
          const newData = {...prev};
          DAYS.forEach(day => {
            if (newData[day]) {
              newData[day][columnId] = '';
            }
          });
          return newData;
        });
      } else {
        console.log('Column type is todo or tasktable, or not found');
      }
      
      return result;
    },
    [clearColumn, columns, setTableData]
  );

  return {
    handleDeleteColumn,
    handleRename,
    handleChangeIcon,
    handleChangeDescription,
    handleToggleTitleVisibility,
    handleChangeOptions,
    handleChangeCheckboxColor,
    handleClearColumn,
  };
};
