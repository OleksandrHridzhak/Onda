import { useState, useEffect } from 'react';
import {
  getAllColumns,
  migrateColumnsFromWeeks,
  getColumnsOrder,
} from '../../../services/columnsDB';
import { settingsService } from '../../../services/settingsDB';
import { deserializeColumns } from '../../../models/columns/columnHelpers';
import { BaseColumn } from '../../../models/columns/BaseColumn';

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
 * Хук для завантаження та управління даними колонок
 */
export const useColumnsData = () => {
  const [columns, setColumns] = useState<BaseColumn[]>([]);
  const [tableData, setTableData] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const [loading, setLoading] = useState(true);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Міграція старих даних
        await migrateColumnsFromWeeks();

        // Завантажуємо дані
        const [columnsData, settingsResult, columnOrderData] =
          await Promise.all([
            getAllColumns(),
            settingsService.getSettings(),
            getColumnsOrder(),
          ]);

        // Створюємо колонку "Day"
        const dayColumn = {
          id: 'days',
          type: 'days',
          name: 'Day',
          emojiIcon: '',
          nameVisible: true,
          width: 120,
          description: '',
          setEmojiIcon: async () => false,
          setWidth: async () => false,
          setNameVisible: async () => false,
          setName: async () => false,
          setDescription: async () => false,
          update: async () => false,
          save: async () => false,
          delete: async () => false,
          toJSON: () => ({
            id: 'days',
            type: 'days',
            name: 'Day',
            emojiIcon: '',
            nameVisible: true,
            width: 120,
            description: '',
          }),
        } as BaseColumn;

        let fetchedColumns: BaseColumn[] = [dayColumn];

        // Використовуємо екземпляри класів напряму
        if (columnsData && columnsData.length > 0) {
          const columnInstances = deserializeColumns(columnsData);
          fetchedColumns = [dayColumn, ...columnInstances];
        }

        // Застосовуємо порядок колонок
        fetchedColumns = applyColumnOrder(
          fetchedColumns,
          columnOrderData,
          settingsResult,
        );

        setColumns(fetchedColumns);
        setColumnOrder(fetchedColumns.map((col) => col.id));

        // Оновлюємо налаштування з новим порядком
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

        // Ініціалізуємо дані таблиці
        const initialTableData = initializeTableData(fetchedColumns);
        setTableData(initialTableData);
      } catch (err) {
        handleError('Error fetching data:', err);
        // Fallback до порожньої таблиці
        const dayColumn = {
          id: 'days',
          type: 'days',
          name: 'Day',
          emojiIcon: '',
          nameVisible: true,
          width: 120,
          description: '',
          setEmojiIcon: async () => false,
          setWidth: async () => false,
          setNameVisible: async () => false,
          setName: async () => false,
          setDescription: async () => false,
          update: async () => false,
          save: async () => false,
          delete: async () => false,
          toJSON: () => ({
            id: 'days',
            type: 'days',
            name: 'Day',
            emojiIcon: '',
            nameVisible: true,
            width: 120,
            description: '',
          }),
        } as BaseColumn;
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
 * Застосовує порядок колонок
 */
const applyColumnOrder = (
  columns: BaseColumn[],
  columnOrderData: string[],
  settingsResult: Settings,
): BaseColumn[] => {
  const dayColumn = columns[0]; // 'days' завжди перший

  if (columnOrderData && columnOrderData.length > 0) {
    const orderedColumns = [dayColumn];
    columnOrderData.forEach((columnId) => {
      const col = columns.find((c) => c.id === columnId);
      if (col && col.id !== 'days') orderedColumns.push(col);
    });

    // Додаємо колонки які не в порядку
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
      .filter((col): col is BaseColumn => col !== undefined);

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
 * Ініціалізує дані таблиці з колонок
 */
const initializeTableData = (
  columns: BaseColumn[],
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
            // Беремо дані з days
            const dayValue = 'days' in col && col.days ? col.days[day] : '';

            dayData[col.id] =
              col.type === 'multi-select' || col.type === 'multicheckbox'
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
