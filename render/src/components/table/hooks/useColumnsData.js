import { useState, useEffect } from 'react';
import {
  getAllColumns,
  migrateColumnsFromWeeks,
  getColumnsOrder,
} from '../../../services/columnsDB';
import { settingsService } from '../../../services/settingsDB';
import { deserializeColumns } from '../../utils/columnHelpers';
import { instanceToLegacy } from '../../utils/columnAdapter';

const handleError = (message, error) => {
  console.error(message, error);
};

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
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [columnOrder, setColumnOrder] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
          ColumnId: 'days',
          Type: 'days',
          Name: 'Day',
          EmojiIcon: '',
          NameVisible: true,
        };

        let fetchedColumns = [dayColumn];

        // Конвертуємо колонки з класів в legacy формат
        if (columnsData && columnsData.length > 0) {
          const columnInstances = deserializeColumns(columnsData);
          const compatibleColumns = columnInstances.map(instanceToLegacy);
          fetchedColumns = [dayColumn, ...compatibleColumns];
        }

        // Застосовуємо порядок колонок
        fetchedColumns = applyColumnOrder(
          fetchedColumns,
          columnOrderData,
          settingsResult
        );

        setColumns(fetchedColumns);
        setColumnOrder(fetchedColumns.map((col) => col.ColumnId));

        // Оновлюємо налаштування з новим порядком
        if (settingsResult.status === 'Settings fetched') {
          const newSettings = {
            ...settingsResult.data,
            table: {
              ...settingsResult.data.table,
              columnOrder: fetchedColumns.map((col) => col.ColumnId),
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
          ColumnId: 'days',
          Type: 'days',
          Name: 'Day',
          EmojiIcon: '',
          NameVisible: true,
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
 * Застосовує порядок колонок
 */
const applyColumnOrder = (columns, columnOrderData, settingsResult) => {
  const dayColumn = columns[0]; // 'days' завжди перший

  if (columnOrderData && columnOrderData.length > 0) {
    const orderedColumns = [dayColumn];
    columnOrderData.forEach((columnId) => {
      const col = columns.find(
        (c) => c.ColumnId === columnId || c._instance?.id === columnId
      );
      if (col && col.ColumnId !== 'days') orderedColumns.push(col);
    });

    // Додаємо колонки які не в порядку
    columns.forEach((column) => {
      if (
        column.ColumnId !== 'days' &&
        !orderedColumns.some((col) => col.ColumnId === column.ColumnId)
      ) {
        orderedColumns.push(column);
      }
    });

    return orderedColumns;
  } else if (
    settingsResult.status === 'Settings fetched' &&
    settingsResult.data.table?.columnOrder?.length > 0
  ) {
    const orderedColumns = settingsResult.data.table.columnOrder
      .map((columnId) => columns.find((col) => col.ColumnId === columnId))
      .filter(Boolean);

    columns.forEach((column) => {
      if (!orderedColumns.some((col) => col.ColumnId === column.ColumnId)) {
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
const initializeTableData = (columns) => {
  return DAYS.reduce((acc, day) => {
    acc[day] = columns.reduce((dayData, col) => {
      if (
        col.ColumnId !== 'days' &&
        col.Type !== 'tasktable' &&
        col.Type !== 'todo'
      ) {
        // Беремо дані з _instance.days або з Chosen
        const dayValue = col._instance?.days?.[day] ?? col.Chosen?.[day] ?? '';

        dayData[col.ColumnId] =
          col.Type === 'multi-select' || col.Type === 'multicheckbox'
            ? typeof dayValue === 'string'
              ? dayValue
              : ''
            : dayValue;
      }
      return dayData;
    }, {});
    return acc;
  }, {});
};
