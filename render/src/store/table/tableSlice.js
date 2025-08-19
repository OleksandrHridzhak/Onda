import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const electronAPI = window.electronAPI || {
  getTableData: async () => ({ status: 'Data fetched', data: [] }),
};

export const fetchTable = createAsyncThunk('table/fetchTable', async () => {
  const result = await electronAPI.getTableData();
  if (result.status === 'Data fetched') {
    return result.data;
  }
  return [];
});

export const updateColumn = createAsyncThunk(
  'table/updateColumn',
  async ({ id, updatedColumn }) => {
    const result = await electronAPI.changeColumn(updatedColumn); // відправка на бек
    if (result.status === 'Success') {
      return result.data; // повертаємо новий об'єкт колонки
    }
    throw new Error('Update failed');
  }
);
export const deleteColumn = createAsyncThunk(
  'table/deleteColumn',
  async (id) => {
    const result = await electronAPI.deleteComponent(id); 
    console.log(result)
    if (result) {
      return id; 
    }
    throw new Error('Update failed');
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    columns: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
      .addCase(updateColumn.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.columns.findIndex(c => c.ColumnId === updated.ColumnId);
        if (index !== -1) {
          state.columns[index] = updated; // заміна старої колонки на нову
        }
      })
      .addCase(updateColumn.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        console.log(state.columns);
        state.columns = state.columns.filter(col => col.ColumnId !== action.payload);
      });

  },
});

export default tableSlice.reducer;
