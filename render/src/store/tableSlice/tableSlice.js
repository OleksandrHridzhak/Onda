import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { columnsFactory } from './columnsFactory';
import {
  getAllColumns,
  addColumn as addColumnToDB,
  updateColumn as updateColumnInDB,
  deleteColumn as deleteColumnFromDB,
  getColumnsOrder,
  updateColumnsOrder,
} from '../../services/columnsDB';

// Helper function to convert IndexedDB format to Redux format
const convertToReduxFormat = (dbColumn) => {
  const baseProps = {
    Name: dbColumn.name || '',
    Type: dbColumn.type?.toUpperCase() || '',
    EmojiIcon: dbColumn.emojiIcon || 'Star',
    NameVisible: dbColumn.nameVisible !== undefined ? dbColumn.nameVisible : true,
    Width: dbColumn.width || 100,
    Description: dbColumn.description || '',
  };

  // Build uniqueProperties based on column type
  const uniqueProperties = {};
  
  if (dbColumn.days) {
    uniqueProperties.Days = dbColumn.days;
  }
  if (dbColumn.checkboxColor) {
    uniqueProperties.CheckboxColor = dbColumn.checkboxColor;
  }
  if (dbColumn.options) {
    uniqueProperties.Options = dbColumn.options;
  }
  if (dbColumn.tagColors) {
    uniqueProperties.TagsColors = dbColumn.tagColors;
    uniqueProperties.OptionsColors = dbColumn.tagColors;
  }
  if (dbColumn.doneTags) {
    uniqueProperties.DoneTags = dbColumn.doneTags;
  }
  if (dbColumn.tasks) {
    uniqueProperties.Chosen = { global: dbColumn.tasks };
  }
  // For multi-select, also add Tags
  if (dbColumn.type === 'multi-select' && dbColumn.options) {
    uniqueProperties.Tags = dbColumn.options;
  }
  // For todo, add Categorys
  if (dbColumn.type === 'todo' && dbColumn.options) {
    uniqueProperties.Categorys = dbColumn.options;
    uniqueProperties.CategoryColors = dbColumn.tagColors || {};
  }

  return {
    ...baseProps,
    uniqueProperties,
  };
};

// Helper function to convert Redux format to IndexedDB format
const convertToDBFormat = (columnId, reduxColumn) => {
  const dbColumn = {
    id: columnId,
    type: reduxColumn.Type?.toLowerCase() || '',
    name: reduxColumn.Name || '',
    emojiIcon: reduxColumn.EmojiIcon || 'Star',
    nameVisible: reduxColumn.NameVisible !== undefined ? reduxColumn.NameVisible : true,
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

// Async thunk for loading columns from IndexedDB
export const loadColumnsFromDB = createAsyncThunk(
  'tableData/loadColumnsFromDB',
  async (_, { rejectWithValue }) => {
    try {
      const [columnsData, columnOrderData] = await Promise.all([
        getAllColumns(),
        getColumnsOrder(),
      ]);
      
      const columns = {};
      const columnOrder = [];

      if (columnsData && columnsData.length > 0) {
        columnsData.forEach((col) => {
          columns[col.id] = convertToReduxFormat(col);
        });

        // Apply column order if available
        if (columnOrderData && columnOrderData.length > 0) {
          columnOrderData.forEach((id) => {
            if (columns[id]) {
              columnOrder.push(id);
            }
          });
          // Add any columns not in order
          Object.keys(columns).forEach((id) => {
            if (!columnOrder.includes(id)) {
              columnOrder.push(id);
            }
          });
        } else {
          columnOrder.push(...Object.keys(columns));
        }
      }

      return { columns, columnOrder };
    } catch (error) {
      console.error('Error loading columns from DB:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for saving a single column to IndexedDB
export const saveColumnToDB = createAsyncThunk(
  'tableData/saveColumnToDB',
  async ({ columnId, columnData }, { rejectWithValue }) => {
    try {
      const dbFormat = convertToDBFormat(columnId, columnData);
      await updateColumnInDB(dbFormat);
      return { columnId, success: true };
    } catch (error) {
      console.error('Error saving column to DB:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a new column
export const createNewColumnAsync = createAsyncThunk(
  'tableData/createNewColumnAsync',
  async ({ columnType }, { getState, rejectWithValue }) => {
    try {
      const newColumn = columnsFactory(columnType);
      const columnId = Object.keys(newColumn)[0];
      const columnData = newColumn[columnId];
      
      // Save to IndexedDB
      const dbFormat = convertToDBFormat(columnId, columnData);
      const result = await addColumnToDB(dbFormat);
      
      if (!result.status) {
        throw new Error(result.message || 'Failed to save column');
      }
      
      // Update column order
      const state = getState();
      const newOrder = [...state.tableData.columnOrder, columnId];
      await updateColumnsOrder(newOrder);
      
      return { columnId, columnData };
    } catch (error) {
      console.error('Error creating column:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a column
export const deleteColumnAsync = createAsyncThunk(
  'tableData/deleteColumnAsync',
  async ({ columnId }, { getState, rejectWithValue }) => {
    try {
      await deleteColumnFromDB(columnId);
      
      // Update column order
      const state = getState();
      const newOrder = state.tableData.columnOrder.filter((id) => id !== columnId);
      await updateColumnsOrder(newOrder);
      
      return { columnId };
    } catch (error) {
      console.error('Error deleting column:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating column order
export const updateColumnOrderAsync = createAsyncThunk(
  'tableData/updateColumnOrderAsync',
  async ({ newOrder }, { rejectWithValue }) => {
    try {
      await updateColumnsOrder(newOrder);
      return { newOrder };
    } catch (error) {
      console.error('Error updating column order:', error);
      return rejectWithValue(error.message);
    }
  }
);

const tableSlice = createSlice({
  name: 'tableData',
  initialState: {
    columns: {},
    columnOrder: [],
    status: 'idle',
    error: null,
    loaded: false,
  },
  reducers: {
    createNewColumn: (state, action) => {
      const columnType = action.payload.columnType;
      const newColumn = columnsFactory(columnType);
      const columnId = Object.keys(newColumn)[0];
      state.columns[columnId] = newColumn[columnId];
      state.columnOrder.push(columnId);
    },
    deleteColumn: (state, action) => {
      const columnId = action.payload.columnId;
      delete state.columns[columnId];
      state.columnOrder = state.columnOrder.filter((id) => id !== columnId);
    },
    updateColumnNested: (state, action) => {
      const { columnId, path, value } = action.payload;
      
      if (!state.columns[columnId]) return;
      
      // Ensure uniqueProperties exists
      if (!state.columns[columnId].uniqueProperties) {
        state.columns[columnId].uniqueProperties = {};
      }
      
      let obj = state.columns[columnId].uniqueProperties;

      for (let i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) {
          obj[path[i]] = {};
        }
        obj = obj[path[i]];
      }

      obj[path[path.length - 1]] = value;
    },
    updateCommonColumnProperties: (state, action) => {
      const { columnId, properties } = action.payload;
      if (!state.columns[columnId]) return;
      
      state.columns[columnId] = {
        ...state.columns[columnId],
        ...properties,
      };
    },
    swapColumnsPosition: (state, action) => {
      const { id, direction } = action.payload;
      const index = state.columnOrder.indexOf(id);
      if (index === -1) return;

      let newIndex;
      if (direction === 'left' && index > 0) {
        newIndex = index - 1;
      } else if (
        direction === 'right' &&
        index < state.columnOrder.length - 1
      ) {
        newIndex = index + 1;
      } else {
        return;
      }
      const temp = state.columnOrder[newIndex];
      state.columnOrder[newIndex] = state.columnOrder[index];
      state.columnOrder[index] = temp;
    },
    setColumns: (state, action) => {
      state.columns = action.payload.columns;
      state.columnOrder = action.payload.columnOrder;
      state.loaded = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load columns
      .addCase(loadColumnsFromDB.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadColumnsFromDB.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.columns = action.payload.columns;
        state.columnOrder = action.payload.columnOrder;
        state.loaded = true;
      })
      .addCase(loadColumnsFromDB.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loaded = true;
      })
      // Create column
      .addCase(createNewColumnAsync.fulfilled, (state, action) => {
        const { columnId, columnData } = action.payload;
        state.columns[columnId] = columnData;
        state.columnOrder.push(columnId);
      })
      // Delete column
      .addCase(deleteColumnAsync.fulfilled, (state, action) => {
        const { columnId } = action.payload;
        delete state.columns[columnId];
        state.columnOrder = state.columnOrder.filter((id) => id !== columnId);
      })
      // Update column order
      .addCase(updateColumnOrderAsync.fulfilled, (state, action) => {
        state.columnOrder = action.payload.newOrder;
      });
  },
});

export const {
  createNewColumn,
  deleteColumn,
  updateColumnNested,
  updateCommonColumnProperties,
  swapColumnsPosition,
  setColumns,
} = tableSlice.actions;

export default tableSlice.reducer;
