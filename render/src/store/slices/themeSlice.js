import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTheme = createAsyncThunk('theme/fetchTheme', async () => {
  const res = await window.electronAPI?.getTheme?.();
  return res?.darkMode ?? false;
});

export const switchThemeAPI = createAsyncThunk('theme/switchTheme', async (darkMode) => {
  await window.electronAPI?.switchTheme?.(darkMode);
  return darkMode;
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: false,
    status: 'idle',
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
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
