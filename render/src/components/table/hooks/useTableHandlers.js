import { useCallback } from 'react';
import { addColumn, updateColumnsOrder } from '../../../services/columnsDB';
import { createColumn } from '../../utils/columnCreator';
import { instanceToLegacy } from '../../utils/columnAdapter';
import { useColumnOperations } from './useColumnOperations';
import { DAYS } from './useColumnsData';
import {
  COLUMN_WIDTH_MIN,
  COLUMN_WIDTH_MAX,
} from '../../utils/constants';

/**
 * Logs error messages to console
 * @param {string} message - Error message
 * @param {Error} error - Error object
 */
const handleError = (message, error) => {
  console.error(message, error);
};

/**
 * Custom hook for table operation handlers
 * @param {Array} columns - Array of column objects
 * @param {Function} setColumns - State setter for columns
 * @param {Object} tableData - Table data object
 * @param {Function} setTableData - State setter for table data
 * @param {Function} setColumnOrder - State setter for column order
 * @returns {Object} Object containing handler functions for table operations
 */
export const useTableHandlers = (
  columns,
  setColumns,
  tableData,
  setTableData,
  setColumnOrder
) => {
  const { updateDayData, updateTasks, updateProperties } = useColumnOperations(
    columns,
    setColumns
  );

  /**
   * Adds a new column to the table
   * @param {string} type - Type of column to add
   */
  const handleAddColumn = useCallback(
    async (type) => {
      try {
        const newColumnInstance = createColumn(type);
        const columnJson = newColumnInstance.toJSON();

        const result = await addColumn(columnJson);

        if (result.status) {
          const compatibleColumn = instanceToLegacy(newColumnInstance);
          compatibleColumn.Name = 'New Column';

          setColumns((prev) => [...prev, compatibleColumn]);

          // Оновлюємо порядок колонок
          const newOrder = columns
            .filter((c) => c.ColumnId !== 'days')
            .map((c) => c.ColumnId);
          newOrder.push(newColumnInstance.id);
          await updateColumnsOrder(newOrder);

          // Додаємо порожні дані для нових днів (крім todo/tasktable)
          if (type !== 'tasktable' && type !== 'todo') {
            setTableData((prev) => ({
              ...prev,
              ...DAYS.reduce(
                (acc, day) => ({
                  ...acc,
                  [day]: {
                    ...prev[day],
                    [newColumnInstance.id]: '',
                  },
                }),
                {}
              ),
            }));
          }
        }
      } catch (err) {
        handleError('Failed to create column:', err);
      }
    },
    [columns, setColumns, setTableData]
  );

  /**
   * Handles cell data change
   * @param {string} day - Day of the week
   * @param {string} columnId - Column identifier
   * @param {*} value - New value for the cell
   */
  const handleCellChange = useCallback(
    async (day, columnId, value) => {
      const column = columns.find(
        (col) => col.ColumnId === columnId || col._instance?.id === columnId
      );
      if (!column) return;

      // Handle Todo columns
      if (column.Type === 'todo') {
        await updateTasks(columnId, value);
        return;
      }

      // TaskTable is handled separately via handleChangeOptions
      if (column.Type === 'tasktable') return;

      // Normalize checkbox values
      const normalizedValue = column.Type === 'checkbox' ? !!value : value;

      // Update UI immediately
      setTableData((prev) => ({
        ...prev,
        [day]: { ...prev[day], [columnId]: normalizedValue },
      }));

      // Save to database
      try {
        await updateDayData(columnId, day, normalizedValue);
      } catch (err) {
        handleError('Update failed:', err);
        // Rollback on error
        const oldValue =
          column._instance?.days?.[day] ?? column.Chosen?.[day] ?? false;
        setTableData((prev) => ({
          ...prev,
          [day]: { ...prev[day], [columnId]: oldValue },
        }));
      }
    },
    [columns, setTableData, updateDayData, updateTasks]
  );

  /**
   * Adds a task to a TaskTable column
   * @param {string} columnId - Column identifier
   * @param {string} taskText - Text of the task to add
   */
  const handleAddTask = useCallback(
    async (columnId, taskText) => {
      const column = columns.find(
        (col) => col.ColumnId === columnId || col._instance?.id === columnId
      );
      if (!column || column.Type !== 'tasktable') return;

      const updatedOptions = [...(column.Options || []), taskText];
      const updatedTagColors = { ...column.TagColors, [taskText]: 'blue' };

      await updateProperties(columnId, {
        Options: updatedOptions,
        TagColors: updatedTagColors,
      });
    },
    [columns, updateProperties]
  );

  /**
   * Moves a column up or down in order
   * @param {string} columnId - Column identifier
   * @param {string} direction - Direction to move ('up' or 'down')
   */
  const handleMoveColumn = useCallback(
    async (columnId, direction) => {
      const currentIndex = columns.findIndex(
        (col) => col.ColumnId === columnId || col._instance?.id === columnId
      );

      if (
        (direction === 'up' && currentIndex <= 1) ||
        (direction === 'down' && currentIndex === columns.length - 1)
      ) {
        return;
      }

      const newColumns = [...columns];
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newColumns[currentIndex], newColumns[newIndex]] = [
        newColumns[newIndex],
        newColumns[currentIndex],
      ];

      setColumns(newColumns);

      const newColumnOrder = newColumns
        .filter((col) => col.ColumnId !== 'days')
        .map((col) => col._instance?.id || col.ColumnId);
      setColumnOrder(newColumnOrder);

      try {
        await updateColumnsOrder(newColumnOrder);
      } catch (err) {
        handleError('Failed to update column order:', err);
      }
    },
    [columns, setColumns, setColumnOrder]
  );

  /**
   * Changes the width of a column
   * @param {string} columnId - Column identifier
   * @param {number} newWidth - New width value (must be between COLUMN_WIDTH_MIN and COLUMN_WIDTH_MAX)
   */
  const handleChangeWidth = useCallback(
    async (columnId, newWidth) => {
      const width = parseInt(newWidth);
      if (isNaN(width) || width < COLUMN_WIDTH_MIN || width > COLUMN_WIDTH_MAX) {
        handleError(
          'Invalid width value',
          new Error(
            `Width must be between ${COLUMN_WIDTH_MIN} and ${COLUMN_WIDTH_MAX}`
          )
        );
        return;
      }

      await updateProperties(columnId, { Width: width });

      // Update CSS directly
      document
        .querySelectorAll(`[data-column-id="${columnId}"]`)
        .forEach((element) => {
          element.style.width = `${width}px`;
        });
    },
    [updateProperties]
  );

  /**
   * Updates options for multi-select, multicheckbox, and tasktable columns
   * @param {string} columnId - Column identifier
   * @param {Array} options - Array of option values
   * @param {Object} tagColors - Object mapping options to colors
   * @param {Array} doneTags - Array of completed tags (default: [])
   */
  const handleChangeOptions = useCallback(
    async (columnId, options, tagColors, doneTags = []) => {
      await updateProperties(columnId, {
        Options: options,
        TagColors: tagColors,
        DoneTags: doneTags,
      });
    },
    [updateProperties]
  );

  return {
    handleAddColumn,
    handleCellChange,
    handleAddTask,
    handleMoveColumn,
    handleChangeWidth,
    handleChangeOptions,
  };
};
