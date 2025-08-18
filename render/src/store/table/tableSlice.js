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
      });
  },
});

export default tableSlice.reducer;
