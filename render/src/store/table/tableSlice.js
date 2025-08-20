// tableSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const electronAPI = window.electronAPI || {
  getTableData: async () => ({ status: 'Data fetched', data: [] }),
  changeColumn: async () => ({ status: 'Success', data: {} }),
  deleteComponent: async () => ({ status: false }),
  getColumnById: async () => ({ column: null }),
  createComponent: async () => ({ status: false, data: {} }),
  updateColumnOrder: async () => ({}),
};

export const fetchTable = createAsyncThunk('table/fetchTable', async () => {
  const result = await electronAPI.getTableData();
  if (result.status === 'Data fetched') {
    return result.data;
  }
  return [];
});

export const addColumn = createAsyncThunk('table/addColumn', async (type) => {
  const result = await electronAPI.createComponent(type);
  if (result.status) {
    return result.data;
  }
  throw new Error('Add column failed');
});

export const updateColumn = createAsyncThunk('table/updateColumn', async (updatedColumn) => {
  const result = await electronAPI.changeColumn(updatedColumn);
  if (result.status === 'Success') {
    return updatedColumn;
  }
  throw new Error('Update failed');
});

export const deleteColumn = createAsyncThunk('table/deleteColumn', async (id) => {
  const result = await electronAPI.deleteComponent(id);
  if (result.status) {
    return id;
  }
  throw new Error('Delete failed');
});

export const getColumnById = createAsyncThunk('table/getColumnById', async (id) => {
  const result = await electronAPI.getColumnById(id);
  if (result.column) {
    return result.column;
  }
  throw new Error('Column not found');
});

export const moveColumn = createAsyncThunk('table/moveColumn', async ({ columnId, direction }, { getState }) => {
  const { columns } = getState().table;
  const currentIndex = columns.findIndex((col) => col.ColumnId === columnId);
  if ((direction === 'up' && currentIndex <= 1) || (direction === 'down' && currentIndex === columns.length - 1)) {
    throw new Error('Cannot move column');
  }
  const newColumns = [...columns];
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  [newColumns[currentIndex], newColumns[newIndex]] = [newColumns[newIndex], newColumns[currentIndex]];
  await electronAPI.updateColumnOrder(newColumns.map((col) => col.ColumnId));
  return newColumns;
});

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    columns: [],
    loading: false,
    error: null,
    selectedColumn: null,
  },
  reducers: {
    resetSelectedColumn: (state) => {
      state.selectedColumn = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTable.fulfilled, (state, action) => {
        state.loading = false;
        state.columns = action.payload;
      })
      .addCase(fetchTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        state.columns.push(action.payload);
      })
      .addCase(addColumn.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateColumn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateColumn.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.columns.findIndex((c) => c.ColumnId === updated.ColumnId);
        if (index !== -1) {
          state.columns[index] = updated;
        }
      })
      .addCase(updateColumn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteColumn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.loading = false;
        state.columns = state.columns.filter((col) => col.ColumnId !== action.payload);
      })
      .addCase(deleteColumn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getColumnById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getColumnById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedColumn = action.payload;
      })
      .addCase(getColumnById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(moveColumn.fulfilled, (state, action) => {
        state.columns = action.payload;
      })
      .addCase(moveColumn.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetSelectedColumn } = tableSlice.actions;
export default tableSlice.reducer;