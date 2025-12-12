import {
  updateColumn as updateColumnInDB,
  deleteColumn as deleteColumnFromDB,
  updateColumnsOrder,
} from '../../services/columnsDB';

// Helper function to convert Redux format to IndexedDB format
const convertToDBFormat = (columnId, reduxColumn) => {
  const dbColumn = {
    id: columnId,
    type: reduxColumn.Type?.toLowerCase() || '',
    name: reduxColumn.Name || '',
    emojiIcon: reduxColumn.EmojiIcon || 'Star',
    nameVisible:
      reduxColumn.NameVisible !== undefined ? reduxColumn.NameVisible : true,
    width: reduxColumn.Width || 100,
    description: reduxColumn.Description || '',
  };

  const up = reduxColumn.uniqueProperties || {};

  if (up.Days) {
    dbColumn.days = up.Days;
  }
  if (up.CheckboxColor) {
    dbColumn.checkboxColor = up.CheckboxColor;
  }
  if (up.Options) {
    dbColumn.options = up.Options;
  }
  if (up.Tags) {
    dbColumn.options = up.Tags;
  }
  if (up.Categorys) {
    dbColumn.options = up.Categorys;
  }
  if (up.TagsColors) {
    dbColumn.tagColors = up.TagsColors;
  }
  if (up.OptionsColors) {
    dbColumn.tagColors = up.OptionsColors;
  }
  if (up.CategoryColors) {
    dbColumn.tagColors = up.CategoryColors;
  }
  if (up.DoneTags) {
    dbColumn.doneTags = up.DoneTags;
  }
  if (up.Chosen?.global) {
    dbColumn.tasks = up.Chosen.global;
  }

  return dbColumn;
};

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
      // For synchronous createNewColumn, save immediately
      const newColumnId = Object.keys(state.tableData.columns).find(
        (id) => !state.tableData.columnOrder.slice(0, -1).includes(id)
      );
      if (newColumnId) {
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
