import { convertToDBFormat } from './columnConverters';
import {
  updateColumn as updateColumnInDB,
  deleteColumn as deleteColumnFromDB,
  updateColumnsOrder,
} from '../../services/columnsDB';

// Debounce function to prevent too many DB writes
const debounceMap = new Map();

const debounce = (key, fn, delay = 300) => {
  if (debounceMap.has(key)) {
    clearTimeout(debounceMap.get(key));
  }
  debounceMap.set(
    key,
    setTimeout(() => {
      fn();
      debounceMap.delete(key);
    }, delay)
  );
};

// Middleware that automatically saves Redux state changes to IndexedDB
export const tablePersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only process tableData actions
  if (!action.type.startsWith('tableData/')) {
    return result;
  }

  const state = store.getState();

  // Handle different action types
  switch (action.type) {
    case 'tableData/updateColumnNested':
    case 'tableData/updateCommonColumnProperties': {
      const { columnId } = action.payload;
      const columnData = state.tableData.columns[columnId];

      if (columnData) {
        // Debounce to prevent too many writes
        debounce(`column-${columnId}`, async () => {
          try {
            const dbFormat = convertToDBFormat(columnId, columnData);
            await updateColumnInDB(dbFormat);
            console.log('Column saved to IndexedDB:', columnId);
          } catch (error) {
            console.error('Error saving column to IndexedDB:', error);
          }
        });
      }
      break;
    }

    case 'tableData/createNewColumn': {
      // Get the last added column ID from columnOrder (it's always added at the end)
      const columnOrder = state.tableData.columnOrder;
      const newColumnId = columnOrder.length > 0 ? columnOrder[columnOrder.length - 1] : null;
      
      if (newColumnId && state.tableData.columns[newColumnId]) {
        const columnData = state.tableData.columns[newColumnId];
        (async () => {
          try {
            const dbFormat = convertToDBFormat(newColumnId, columnData);
            await updateColumnInDB(dbFormat);
            await updateColumnsOrder(state.tableData.columnOrder);
            console.log('New column saved to IndexedDB:', newColumnId);
          } catch (error) {
            console.error('Error saving new column to IndexedDB:', error);
          }
        })();
      }
      break;
    }

    case 'tableData/deleteColumn': {
      const { columnId } = action.payload;
      (async () => {
        try {
          await deleteColumnFromDB(columnId);
          await updateColumnsOrder(state.tableData.columnOrder);
          console.log('Column deleted from IndexedDB:', columnId);
        } catch (error) {
          console.error('Error deleting column from IndexedDB:', error);
        }
      })();
      break;
    }

    case 'tableData/swapColumnsPosition': {
      // Save new column order
      (async () => {
        try {
          await updateColumnsOrder(state.tableData.columnOrder);
          console.log('Column order saved to IndexedDB');
        } catch (error) {
          console.error('Error saving column order to IndexedDB:', error);
        }
      })();
      break;
    }

    default:
      // No action needed for other action types
      break;
  }

  return result;
};
