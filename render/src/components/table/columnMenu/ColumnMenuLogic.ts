import { useCallback } from 'react';
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
  const handleDeleteColumn = useCallback(
    async (columnId: string): Promise<UpdateResult> => {
      try {
        const column = columns.find((col) => col.id === columnId);
        if (!column) {
          return { status: 'Error', error: 'Column not found' };
        }

        // Use column's own delete method
        const success = await column.delete();
        if (success) {
          setColumns((prev) => prev.filter((col) => col.id !== columnId));
          return { status: 'Column deleted' };
        }
        return { status: 'Error', error: 'Failed to delete column' };
      } catch (err) {
        handleError('Failed to delete column:', err);
        return { status: 'Error', error: (err as Error).message };
      }
    },
    [columns, setColumns],
  );

  const handleRename = useCallback(
    async (columnId: string, newName: string): Promise<UpdateResult> => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) return { status: 'Error', error: 'Column not found' };

      await column.setName(newName);
      setColumns((prev) => [...prev]); // Trigger re-render
      return { status: 'Success' };
    },
    [columns, setColumns],
  );

  const handleChangeIcon = useCallback(
    async (columnId: string, newIcon: string): Promise<UpdateResult> => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) return { status: 'Error', error: 'Column not found' };

      await column.setEmojiIcon(newIcon);
      setColumns((prev) => [...prev]); // Trigger re-render
      return { status: 'Success' };
    },
    [columns, setColumns],
  );

  const handleChangeDescription = useCallback(
    async (columnId: string, newDescription: string): Promise<UpdateResult> => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) return { status: 'Error', error: 'Column not found' };

      await column.setDescription(newDescription);
      setColumns((prev) => [...prev]); // Trigger re-render
      return { status: 'Success' };
    },
    [columns, setColumns],
  );

  const handleToggleTitleVisibility = useCallback(
    async (columnId: string, showTitle: boolean): Promise<UpdateResult> => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) return { status: 'Error', error: 'Column not found' };

      await column.setNameVisible(showTitle);
      setColumns((prev) => [...prev]); // Trigger re-render
      return { status: 'Success' };
    },
    [columns, setColumns],
  );

  const handleChangeOptions = useCallback(
    async (
      columnId: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags: string[] = [],
    ): Promise<UpdateResult> => {
      const column = columns.find((col) => col.id === columnId) as any;
      if (!column) return { status: 'Error', error: 'Column not found' };

      // Use column's own updateOptions method if available
      if ('updateOptions' in column) {
        if (column.type === 'tasktable' && 'updateOptionsAndTags' in column) {
          await column.updateOptionsAndTags(options, tagColors, doneTags);
        } else {
          await column.updateOptions(options, tagColors);
        }
      } else {
        // Fallback for columns without updateOptions
        column.options = options;
        column.tagColors = tagColors;
        if ('doneTags' in column) {
          column.doneTags = doneTags;
        }
        await column.save();
      }

      setColumns((prev) => [...prev]); // Trigger re-render
      return { status: 'Success' };
    },
    [columns, setColumns],
  );

  const handleChangeCheckboxColor = useCallback(
    async (columnId: string, color: string): Promise<UpdateResult> => {
      const column = columns.find((col) => col.id === columnId) as any;
      if (!column) return { status: 'Error', error: 'Column not found' };

      // Use column's own setCheckboxColor method if available
      if ('setCheckboxColor' in column) {
        await column.setCheckboxColor(color);
      } else {
        column.checkboxColor = color;
        await column.save();
      }

      setColumns((prev) => [...prev]); // Trigger re-render
      return { status: 'Success' };
    },
    [columns, setColumns],
  );

  const handleClearColumn = useCallback(
    async (columnId: string): Promise<UpdateResult> => {
      console.log('handleClearColumn called for:', columnId);

      const column = columns.find((col) => col.id === columnId) as any;
      console.log('Found column:', column);

      if (!column) return { status: 'Error', error: 'Column not found' };

      try {
        if (column.type === 'tasktable' && 'clearDoneTasks' in column) {
          // TaskTableColumn - move done tasks back to options
          console.log('Clearing TaskTable');
          await column.clearDoneTasks();
        } else if ('clearDays' in column) {
          // DayBasedColumn (checkbox, numberbox, text, multi-select, multicheckbox)
          console.log('Clearing days for DayBasedColumn');
          await column.clearDays();

          // Also clear tableData for DayBasedColumns
          setTableData((prev) => {
            const newData = { ...prev };
            DAYS.forEach((day) => {
              if (newData[day]) {
                newData[day][columnId] = '';
              }
            });
            return newData;
          });
        } else if ('removeCompletedTasks' in column) {
          // TodoColumn - remove completed tasks
          console.log('Clearing completed tasks for TodoColumn');
          await column.removeCompletedTasks();
        }

        setColumns((prev) => [...prev]); // Trigger re-render
        return { status: 'Success' };
      } catch (err) {
        handleError('Failed to clear column:', err);
        return { status: 'Error', error: (err as Error).message };
      }
    },
    [columns, setColumns, setTableData],
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
