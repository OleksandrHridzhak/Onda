import { useCallback } from 'react';
import { deleteColumn, updateColumn } from '../../../services/columnsDB';
import { ColumnData } from '../../../types/column.types';

interface UpdateResult {
  status: string;
  data?: ColumnData;
  error?: string;
}

/**
 * Hook for column menu logic
 * Works with plain objects without class methods
 */
export const useColumnMenuLogic = (
  columns: ColumnData[],
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>,
) => {
  // General column update function
  const updateColumnInstance = useCallback(
    async (
      columnId: string,
      updateFn: (column: ColumnData) => void,
    ): Promise<UpdateResult> => {
      let updatedColumn: ColumnData | undefined;

      setColumns((prev) => {
        const columnIndex = prev.findIndex((col) => col.id === columnId);
        if (columnIndex === -1) return prev;

        // Create column copy
        const column = { ...prev[columnIndex] };

        // Call update function
        updateFn(column);
        updatedColumn = column;

        // Return new array with updated column
        const newColumns = [...prev];
        newColumns[columnIndex] = column;
        return newColumns;
      });

      try {
        if (!updatedColumn) {
          return { status: 'Error', error: 'Column not found' };
        }
        await updateColumn(updatedColumn);
        return { status: 'Success', data: updatedColumn };
      } catch (err) {
        console.error('Update failed:', err);
        // Rollback by reloading
        setColumns((prev) => [...prev]);
        return { status: 'Error', error: (err as Error).message };
      }
    },
    [setColumns],
  );

  // Delete column
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

  // Rename column
  const handleRename = useCallback(
    async (columnId: string, newName: string): Promise<UpdateResult> => {
      return await updateColumnInstance(columnId, (column) => {
        column.name = newName;
      });
    },
    [updateColumnInstance],
  );

  // Change icon
  const handleChangeIcon = useCallback(
    (columnId: string, newIcon: string): Promise<UpdateResult> => {
      return updateColumnInstance(columnId, (column) => {
        column.emojiIcon = newIcon;
      });
    },
    [updateColumnInstance],
  );

  // Change description
  const handleChangeDescription = useCallback(
    async (columnId: string, newDescription: string): Promise<UpdateResult> => {
      return await updateColumnInstance(columnId, (column) => {
        column.description = newDescription;
      });
    },
    [updateColumnInstance],
  );

  // Toggle title visibility
  const handleToggleTitleVisibility = useCallback(
    (columnId: string, showTitle: boolean): Promise<UpdateResult> => {
      return updateColumnInstance(columnId, (column) => {
        column.nameVisible = showTitle;
      });
    },
    [updateColumnInstance],
  );

  // Change options (for columns with options)
  const handleChangeOptions = useCallback(
    (
      columnId: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags: string[] = [],
    ): Promise<UpdateResult> => {
      return updateColumnInstance(columnId, (column) => {
        if ('options' in column) {
          (column as any).options = options;
          (column as any).tagColors = tagColors;
        }
        if ('doneTags' in column) {
          (column as any).doneTags = doneTags;
        }
      });
    },
    [updateColumnInstance],
  );

  // Change checkbox color
  const handleChangeCheckboxColor = useCallback(
    (columnId: string, color: string): Promise<UpdateResult> => {
      return updateColumnInstance(columnId, (column) => {
        if ('checkboxColor' in column) {
          (column as any).checkboxColor = color;
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
