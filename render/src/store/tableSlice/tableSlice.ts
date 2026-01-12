import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { columnsFactory } from './columnsFactory';
import {
  getAllColumnsIDB,
  addColumn as addColumnToDB,
  updateColumn as updateColumnInDB,
  deleteColumn as deleteColumnFromDB,
  getColumnsOrder,
  updateColumnsOrder,
} from '../../services/indexedDB/columnsDB';

// Async thunk for loading columns from IndexedDB
export const loadColumnsFromDB = createAsyncThunk<
  { columns: Record<string, any>; columnOrder: string[] },
  void,
  { rejectValue: string }
>('tableData/loadColumnsFromDB', async (_, { rejectWithValue }) => {
  try {
    const [columnsData, columnOrderData] = await Promise.all([
      getAllColumnsIDB(),
      getColumnsOrder(),
    ]);

    const columns = {};
    const columnOrder = [];

    if (columnsData && columnsData.length > 0) {
      columnsData.forEach((col) => {
        columns[col.id] = col;
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
});

// Async thunk for saving a single column to IndexedDB
export const saveColumnToDB = createAsyncThunk<
  { columnId: string; success: true },
  { columnId: string; columnData: any },
  { rejectValue: string }
>(
  'tableData/saveColumnToDB',
  async (
    { columnId, columnData }: { columnId: string; columnData: any },
    { rejectWithValue },
  ) => {
    try {
      await updateColumnInDB({ id: columnId, ...columnData });
      return { columnId, success: true };
    } catch (error) {
      console.error('Error saving column to DB:', error);
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for creating a new column
export const createNewColumnAsync = createAsyncThunk<
  { columnId: string; columnData: any },
  { columnType: string },
  { state: any; rejectValue: string }
>(
  'tableData/createNewColumnAsync',
  async (
    { columnType }: { columnType: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const newColumn = columnsFactory(columnType);
      const columnId = Object.keys(newColumn)[0];
      const columnData = newColumn[columnId];

      // Save to IndexedDB
      const result = await addColumnToDB({ id: columnId, ...columnData });

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
  },
);

// Async thunk for deleting a column
export const deleteColumnAsync = createAsyncThunk<
  { columnId: string },
  { columnId: string },
  { state: any; rejectValue: string }
>(
  'tableData/deleteColumnAsync',
  async ({ columnId }: { columnId: string }, { getState, rejectWithValue }) => {
    try {
      await deleteColumnFromDB(columnId);

      // Update column order
      const state = getState();
      const newOrder = state.tableData.columnOrder.filter(
        (id) => id !== columnId,
      );
      await updateColumnsOrder(newOrder);

      return { columnId };
    } catch (error) {
      console.error('Error deleting column:', error);
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for updating column order
export const updateColumnOrderAsync = createAsyncThunk<
  { newOrder: string[] },
  { newOrder: string[] },
  { rejectValue: string }
>(
  'tableData/updateColumnOrderAsync',
  async ({ newOrder }: { newOrder: string[] }, { rejectWithValue }) => {
    try {
      await updateColumnsOrder(newOrder);
      return { newOrder };
    } catch (error) {
      console.error('Error updating column order:', error);
      return rejectWithValue(error.message);
    }
  },
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

      let obj = state.columns[columnId];

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
