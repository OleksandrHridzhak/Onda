import { useState, useEffect } from 'react';
import { getAllColumns, getColumnsOrder } from '../../../services/columnsDB';
import { settingsService } from '../../../services/settingsDB';
import { ColumnData } from '../../../types/column.types';

const handleError = (message: string, error: unknown): void => {
  console.error(message, error);
};

interface Settings {
  status: string;
  data?: {
    table?: {
      columnOrder?: string[];
    };
    [key: string]: unknown;
  };
}

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Hook for loading and managing column data
 */
export const useColumnsData = () => {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [tableData, setTableData] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const [loading, setLoading] = useState(true);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Load data
        const [columnsData, settingsResult, columnOrderData] =
          await Promise.all([
            getAllColumns(),
            settingsService.getSettings(),
            getColumnsOrder(),
          ]);

        // Create "Day" column
        const dayColumn: ColumnData = {
          id: 'days',
          type: 'days',
          name: 'Day',
          emojiIcon: '',
          nameVisible: true,
          width: 120,
          description: '',
        };

        let fetchedColumns: ColumnData[] = [dayColumn];

        // Use data from IndexedDB directly
        if (columnsData && columnsData.length > 0) {
          fetchedColumns = [dayColumn, ...(columnsData as ColumnData[])];
        }

        // Apply column order
        fetchedColumns = applyColumnOrder(
          fetchedColumns,
          columnOrderData,
          settingsResult,
        );

        setColumns(fetchedColumns);
        setColumnOrder(fetchedColumns.map((col) => col.id));

        // Update settings with new order
        if (settingsResult.status === 'Settings fetched') {
          const newSettings = {
            ...settingsResult.data,
            table: {
              ...settingsResult.data?.table,
              columnOrder: fetchedColumns.map((col) => col.id),
            },
          };
          await settingsService.updateSettings(newSettings);
        }

        // Initialize table data
        const initialTableData = initializeTableData(fetchedColumns);
        setTableData(initialTableData);
      } catch (err) {
        handleError('Error fetching data:', err);
        // Fallback to empty table
        const dayColumn: ColumnData = {
          id: 'days',
          type: 'days',
          name: 'Day',
          emojiIcon: '',
          nameVisible: true,
          width: 120,
          description: '',
        };
        setColumns([dayColumn]);
        setTableData(DAYS.reduce((acc, day) => ({ ...acc, [day]: {} }), {}));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    columns,
    setColumns,
    tableData,
    setTableData,
    loading,
    columnOrder,
    setColumnOrder,
  };
};

/**
 * Applies column order
 */
const applyColumnOrder = (
  columns: ColumnData[],
  columnOrderData: string[],
  settingsResult: Settings,
): ColumnData[] => {
  const dayColumn = columns[0]; // 'days' is always first

  if (columnOrderData && columnOrderData.length > 0) {
    const orderedColumns = [dayColumn];
    columnOrderData.forEach((columnId) => {
      const col = columns.find((c) => c.id === columnId);
      if (col && col.id !== 'days') orderedColumns.push(col);
    });

    // Add columns not in order
    columns.forEach((column) => {
      if (
        column.id !== 'days' &&
        !orderedColumns.some((col) => col.id === column.id)
      ) {
        orderedColumns.push(column);
      }
    });

    return orderedColumns;
  } else if (
    settingsResult.status === 'Settings fetched' &&
    settingsResult.data?.table?.columnOrder &&
    settingsResult.data.table.columnOrder.length > 0
  ) {
    const orderedColumns = settingsResult.data.table.columnOrder
      .map((columnId) => columns.find((col) => col.id === columnId))
      .filter((col): col is ColumnData => col !== undefined);

    columns.forEach((column) => {
      if (!orderedColumns.some((col) => col.id === column.id)) {
        orderedColumns.push(column);
      }
    });

    return orderedColumns;
  }

  return columns;
};

/**
 * Initializes table data from columns
 */
const initializeTableData = (
  columns: ColumnData[],
): Record<string, Record<string, unknown>> => {
  return DAYS.reduce(
    (acc, day) => {
      acc[day] = columns.reduce(
        (dayData, col) => {
          if (
            col.id !== 'days' &&
            col.type !== 'tasktable' &&
            col.type !== 'todo'
          ) {
            // Get data from days
            const dayValue = 'days' in col && col.days ? col.days[day] : '';

            dayData[col.id] =
              col.type === 'multiselect' || col.type === 'multicheckbox'
                ? typeof dayValue === 'string'
                  ? dayValue
                  : ''
                : dayValue;
          }
          return dayData;
        },
        {} as Record<string, unknown>,
      );
      return acc;
    },
    {} as Record<string, Record<string, unknown>>,
  );
};
