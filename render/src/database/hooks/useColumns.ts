/**
 * React Hook for Columns Data
 *
 * Provides reactive access to columns data from RxDB.
 * Automatically updates when data changes.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getDatabase, Column } from '../index';
import { notifyDataChange } from '../../services/autoSync';

// Constants for column defaults
const COLUMN_WIDTHS: Record<string, number> = {
  TODO: 150,
  CHECKBOX: 50,
  NUMBERBOX: 60,
  TEXT: 130,
  MULTISELECT: 120,
  MULTICHECKBOX: 50,
  TASKTABLE: 150,
};

const COLUMN_NAME_VISIBLE: Record<string, boolean> = {
  TODO: true,
  CHECKBOX: false,
  NUMBERBOX: false,
  TEXT: true,
  MULTISELECT: true,
  MULTICHECKBOX: false,
  TASKTABLE: true,
};

const COLUMN_EMOJI_ICON: Record<string, string> = {
  TODO: 'ListTodo',
  CHECKBOX: 'Star',
  NUMBERBOX: 'Star',
  TEXT: 'Star',
  MULTISELECT: 'Star',
  MULTICHECKBOX: 'Circle',
  TASKTABLE: 'ListTodo',
};

const COLUMN_NAMES: Record<string, string> = {
  TODO: 'Todo',
  CHECKBOX: 'Checkbox',
  NUMBERBOX: 'Numberbox',
  TEXT: 'Text',
  MULTISELECT: 'MultiSelect',
  MULTICHECKBOX: 'Multicheckbox',
  TASKTABLE: 'Tasktable',
};

// Generate UUID
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
};

// Column factory functions
const createColumnData = (type: string): Omit<Column, 'id' | 'updatedAt'> => {
  const upperType = type.toUpperCase();
  const baseColumn = {
    name: COLUMN_NAMES[upperType] || type,
    type: upperType,
    emojiIcon: COLUMN_EMOJI_ICON[upperType] || 'Star',
    nameVisible: COLUMN_NAME_VISIBLE[upperType] ?? true,
    width: COLUMN_WIDTHS[upperType] || 100,
  };

  const uniqueProperties: Record<string, unknown> = {};

  switch (type.toLowerCase()) {
    case 'todo':
      uniqueProperties.Chosen = { global: [] };
      uniqueProperties.Categorys = ['Option 1', 'Option 2'];
      uniqueProperties.CategoryColors = {
        'Option 1': 'blue',
        'Option 2': 'green',
      };
      break;
    case 'checkbox':
      uniqueProperties.Days = {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      };
      uniqueProperties.CheckboxColor = 'green';
      break;
    case 'numberbox':
    case 'text':
      uniqueProperties.Days = {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: '',
      };
      break;
    case 'multiselect':
      uniqueProperties.Days = {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: '',
      };
      uniqueProperties.Tags = ['Option 1', 'Option 2'];
      uniqueProperties.TagsColors = { 'Option 1': 'blue', 'Option 2': 'green' };
      break;
    case 'multicheckbox':
      uniqueProperties.Days = {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: '',
      };
      uniqueProperties.Options = ['Task 1', 'Task 2'];
      uniqueProperties.OptionsColors = { 'Task 1': 'blue', 'Task 2': 'green' };
      break;
    case 'tasktable':
      uniqueProperties.Chosen = {};
      uniqueProperties.Options = ['Task 1', 'Task 2'];
      uniqueProperties.OptionsColors = { 'Task 1': 'blue', 'Task 2': 'green' };
      break;
    default:
      break;
  }

  return { ...baseColumn, uniqueProperties };
};

export interface ColumnsState {
  columns: Record<string, Column>;
  columnOrder: string[];
  loaded: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export function useColumns() {
  const [state, setState] = useState<ColumnsState>({
    columns: {},
    columnOrder: [],
    loaded: false,
    status: 'idle',
    error: null,
  });

  // Load data and subscribe to changes
  useEffect(() => {
    let columnsSubscription: { unsubscribe: () => void } | null = null;
    let orderSubscription: { unsubscribe: () => void } | null = null;
    let mounted = true;

    const init = async () => {
      setState((prev) => ({ ...prev, status: 'loading' }));

      try {
        const db = await getDatabase();

        // Subscribe to columns changes
        columnsSubscription = db.columns.find().$.subscribe((docs) => {
          if (!mounted) return;
          const columns: Record<string, Column> = {};
          docs.forEach((doc) => {
            const data = doc.toJSON();
            columns[data.id] = data;
          });
          setState((prev) => ({
            ...prev,
            columns,
            status: 'succeeded',
            loaded: true,
          }));
        });

        // Subscribe to column order changes
        orderSubscription = db.columnsorder
          .findOne('columnsOrder')
          .$.subscribe((doc) => {
            if (!mounted) return;
            const columnIds = doc ? doc.columnIds : [];
            setState((prev) => ({
              ...prev,
              columnOrder: columnIds,
            }));
          });
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            status: 'failed',
            error: (error as Error).message,
            loaded: true,
          }));
        }
      }
    };

    init();

    return () => {
      mounted = false;
      columnsSubscription?.unsubscribe();
      orderSubscription?.unsubscribe();
    };
  }, []);

  // Create a new column
  const createColumn = useCallback(async (columnType: string) => {
    try {
      const db = await getDatabase();
      const id = generateId();
      const columnData = createColumnData(columnType);
      const column: Column = {
        id,
        ...columnData,
        updatedAt: Date.now(),
      };

      await db.columns.insert(column);

      // Update column order
      const orderDoc = await db.columnsorder.findOne('columnsOrder').exec();
      const currentOrder = orderDoc ? orderDoc.columnIds : [];
      const newOrder = [...currentOrder, id];

      await db.columnsorder.upsert({
        id: 'columnsOrder',
        columnIds: newOrder,
        updatedAt: Date.now(),
      });

      notifyDataChange();
      return { columnId: id, columnData: column };
    } catch (error) {
      console.error('Error creating column:', error);
      throw error;
    }
  }, []);

  // Delete a column
  const deleteColumn = useCallback(async (columnId: string) => {
    try {
      const db = await getDatabase();

      // Delete the column
      const doc = await db.columns.findOne(columnId).exec();
      if (doc) {
        await doc.remove();
      }

      // Update column order
      const orderDoc = await db.columnsorder.findOne('columnsOrder').exec();
      if (orderDoc) {
        const newOrder = orderDoc.columnIds.filter(
          (id: string) => id !== columnId,
        );
        await db.columnsorder.upsert({
          id: 'columnsOrder',
          columnIds: newOrder,
          updatedAt: Date.now(),
        });
      }

      notifyDataChange();
    } catch (error) {
      console.error('Error deleting column:', error);
      throw error;
    }
  }, []);

  // Update column nested property
  const updateColumnNested = useCallback(
    async (columnId: string, path: string[], value: unknown) => {
      try {
        const db = await getDatabase();
        const doc = await db.columns.findOne(columnId).exec();

        if (!doc) return;

        const data = doc.toJSON();

        // Navigate to the nested property
        if (path.length === 1) {
          // Direct property on uniqueProperties
          const newUniqueProperties = {
            ...data.uniqueProperties,
            [path[0]]: value,
          };
          await doc.patch({
            uniqueProperties: newUniqueProperties,
            updatedAt: Date.now(),
          });
        } else if (path.length === 2) {
          // Nested property like Days.Monday
          const parentKey = path[0];
          const childKey = path[1];
          const parentObj =
            (data.uniqueProperties[parentKey] as Record<string, unknown>) || {};
          const newUniqueProperties = {
            ...data.uniqueProperties,
            [parentKey]: {
              ...parentObj,
              [childKey]: value,
            },
          };
          await doc.patch({
            uniqueProperties: newUniqueProperties,
            updatedAt: Date.now(),
          });
        } else if (path.length > 2) {
          // Deeper nested property
          const newUniqueProperties = { ...data.uniqueProperties };
          let obj: Record<string, unknown> = newUniqueProperties;
          for (let i = 0; i < path.length - 1; i++) {
            if (!obj[path[i]]) {
              obj[path[i]] = {};
            }
            obj = obj[path[i]] as Record<string, unknown>;
          }
          obj[path[path.length - 1]] = value;
          await doc.patch({
            uniqueProperties: newUniqueProperties,
            updatedAt: Date.now(),
          });
        }

        notifyDataChange();
      } catch (error) {
        console.error('Error updating column nested:', error);
        throw error;
      }
    },
    [],
  );

  // Update common column properties
  const updateColumnProperties = useCallback(
    async (
      columnId: string,
      properties: Partial<
        Omit<Column, 'id' | 'uniqueProperties' | 'updatedAt'>
      >,
    ) => {
      try {
        const db = await getDatabase();
        const doc = await db.columns.findOne(columnId).exec();

        if (!doc) return;

        await doc.patch({
          ...properties,
          updatedAt: Date.now(),
        });

        notifyDataChange();
      } catch (error) {
        console.error('Error updating column properties:', error);
        throw error;
      }
    },
    [],
  );

  // Swap columns position
  const swapColumnsPosition = useCallback(
    async (id: string, direction: 'left' | 'right') => {
      try {
        const db = await getDatabase();
        const orderDoc = await db.columnsorder.findOne('columnsOrder').exec();

        if (!orderDoc) return;

        const columnOrder = [...orderDoc.columnIds];
        const index = columnOrder.indexOf(id);

        if (index === -1) return;

        let newIndex: number;
        if (direction === 'left' && index > 0) {
          newIndex = index - 1;
        } else if (direction === 'right' && index < columnOrder.length - 1) {
          newIndex = index + 1;
        } else {
          return;
        }

        // Swap positions
        const temp = columnOrder[newIndex];
        columnOrder[newIndex] = columnOrder[index];
        columnOrder[index] = temp;

        await db.columnsorder.upsert({
          id: 'columnsOrder',
          columnIds: columnOrder,
          updatedAt: Date.now(),
        });

        notifyDataChange();
      } catch (error) {
        console.error('Error swapping columns position:', error);
        throw error;
      }
    },
    [],
  );

  // Update column order
  const updateColumnOrder = useCallback(async (newOrder: string[]) => {
    try {
      const db = await getDatabase();
      await db.columnsorder.upsert({
        id: 'columnsOrder',
        columnIds: newOrder,
        updatedAt: Date.now(),
      });
      notifyDataChange();
    } catch (error) {
      console.error('Error updating column order:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    createColumn,
    deleteColumn,
    updateColumnNested,
    updateColumnProperties,
    swapColumnsPosition,
    updateColumnOrder,
  };
}

/**
 * Hook to get a single column by ID
 */
export function useColumn(columnId: string) {
  const {
    columns,
    updateColumnNested,
    updateColumnProperties,
    deleteColumn,
    swapColumnsPosition,
  } = useColumns();

  const columnData = useMemo(
    () => columns[columnId] || null,
    [columns, columnId],
  );

  return {
    columnData,
    updateNested: (path: string[], value: unknown) =>
      updateColumnNested(columnId, path, value),
    updateProperties: (
      properties: Partial<
        Omit<Column, 'id' | 'uniqueProperties' | 'updatedAt'>
      >,
    ) => updateColumnProperties(columnId, properties),
    deleteColumn: () => deleteColumn(columnId),
    swapPosition: (direction: 'left' | 'right') =>
      swapColumnsPosition(columnId, direction),
  };
}
