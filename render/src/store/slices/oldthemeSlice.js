import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchTheme = createAsyncThunk('theme/fetchTheme', async () => {
  const res = await window.electronAPI?.getTheme?.();
  return res?.darkMode ?? true;
});


export const switchThemeAPI = createAsyncThunk('theme/switchTheme', async (darkMode) => {
  await window.electronAPI?.switchTheme?.(darkMode);
  localStorage.setItem('darkMode', darkMode); 
  return darkMode;
});

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
