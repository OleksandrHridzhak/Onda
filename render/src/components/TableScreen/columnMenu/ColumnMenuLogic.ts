import { useCallback } from 'react';
import { deleteColumn } from '../../../services/columnsDB';
import { useColumnOperations } from '../hooks/useColumnOperations';
import { DAYS } from '../hooks/useColumnsData';
import { BaseColumn } from '../../../models/columns/BaseColumn';

const handleError = (message: string, error: unknown): void => {
  console.error(message, error);
};

type Column = BaseColumn;

interface UpdateResult {
  status: string;
  data?: unknown;
  error?: string;
}

/**
 * Хук для логіки меню колонок
 * Забезпечує операції оновлення, видалення та модифікації колонок
 */
export const useColumnMenuLogic = (
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  setTableData: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, unknown>>>
  >,
) => {
  const { updateProperties, clearColumn } = useColumnOperations(
    columns,
    setColumns,
  );

  const handleDeleteColumn = useCallback(
    async (columnId: string): Promise<UpdateResult> => {
      try {
        const column = columns.find((col) => col.id === columnId);
        if (!column) {
          return { status: 'Error', error: 'Column not found' };
        }

        const result = await deleteColumn(columnId);
        if (result.status || result.status === 'Column deleted') {
          setColumns((prev) => prev.filter((col) => col.id !== columnId));
        }
        return result;
      } catch (err) {
        handleError('Failed to delete column:', err);
        return { status: 'Error', error: (err as Error).message };
      }
    },
    [columns, setColumns],
  );

  const handleRename = useCallback(
    async (columnId: string, newName: string): Promise<UpdateResult> => {
      return await updateProperties(columnId, { Name: newName });
    },
    [updateProperties],
  );

  const handleChangeIcon = useCallback(
    (columnId: string, newIcon: string): Promise<UpdateResult> => {
      return updateProperties(columnId, { EmojiIcon: newIcon });
    },
    [updateProperties],
  );

  const handleChangeDescription = useCallback(
    async (columnId: string, newDescription: string): Promise<UpdateResult> => {
      return await updateProperties(columnId, { Description: newDescription });
    },
    [updateProperties],
  );

  const handleToggleTitleVisibility = useCallback(
    (columnId: string, showTitle: boolean): Promise<UpdateResult> => {
      return updateProperties(columnId, { NameVisible: showTitle });
    },
    [updateProperties],
  );

  const handleChangeOptions = useCallback(
    (
      columnId: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags: string[] = [],
    ): Promise<UpdateResult> => {
      return updateProperties(columnId, {
        Options: options,
        TagColors: tagColors,
        DoneTags: doneTags,
      });
    },
    [updateProperties],
  );

  const handleChangeCheckboxColor = useCallback(
    (columnId: string, color: string): Promise<UpdateResult> => {
      return updateProperties(columnId, { CheckboxColor: color });
    },
    [updateProperties],
  );

  const handleClearColumn = useCallback(
    async (columnId: string): Promise<UpdateResult> => {
      console.log('handleClearColumn called for:', columnId);

      // Clear column data in database and update columns state
      const result = await clearColumn(columnId);
      console.log('clearColumn result:', result);

      // For DayBasedColumn types, also clear tableData
      const column = columns.find((col) => col.id === columnId);
      console.log('Found column:', column);

      if (column && column.type !== 'todo' && column.type !== 'tasktable') {
        console.log('Clearing tableData for DayBasedColumn');
        // Clear tableData for DayBasedColumns (checkbox, multicheckbox, number, notes, tags, multiselect)
        setTableData((prev) => {
          const newData = { ...prev };
          DAYS.forEach((day) => {
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
    [clearColumn, columns, setTableData],
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
