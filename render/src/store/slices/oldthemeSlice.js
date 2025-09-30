import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService } from '../../services/settingsDB';
//TODO Delete this slice
export const fetchTheme = createAsyncThunk('theme/fetchTheme', async () => {
  const res = await settingsService?.getSettings?.();
  return res?.darkMode ?? true;
});

export const switchThemeAPI = createAsyncThunk(
  'theme/switchTheme',
  async (darkMode) => {
    await window.electronAPI?.switchTheme?.(darkMode);
    localStorage.setItem('darkMode', darkMode);
    return darkMode;
  }
);

const initialDarkMode = localStorage.getItem('darkMode') === 'true';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: initialDarkMode,
    status: 'idle',
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheme.fulfilled, (state, action) => {
        state.darkMode = action.payload;
        state.status = 'succeeded';
      })
      .addCase(switchThemeAPI.fulfilled, (state, action) => {
        state.darkMode = action.payload;
      });
  },
});

export const { setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
