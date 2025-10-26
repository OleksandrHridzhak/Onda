import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService } from '../../services/settingsDB';

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async () => {
    const response = await settingsService.getSettings();
    return response.data;
  }
);

export const setCustomPageUrl = createAsyncThunk(
  'settings/setCustomPageUrl',
  async (url) => {
    await settingsService.updateCustomPageUrl(url);
    return url;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    url: 'https://www.google.com',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.url = action.payload.customPage?.url || 'https://www.google.com';
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(setCustomPageUrl.fulfilled, (state, action) => {
        state.url = action.payload;
      });
  },
});

export default settingsSlice.reducer;
