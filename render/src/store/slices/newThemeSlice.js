import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  colorScheme: localStorage.getItem('colorScheme') || 'standard',
  themeMode: localStorage.getItem('themeMode') || 'light',
};

const newThemeSlice = createSlice({
  name: 'newTheme',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      const nextMode = state.themeMode === 'light' ? 'dark' : 'light';
      state.themeMode = nextMode;
      localStorage.setItem('themeMode', nextMode);
      document.documentElement.setAttribute('data-theme-mode', nextMode);
    },
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload;
      localStorage.setItem('colorScheme', action.payload);
      document.documentElement.setAttribute(
        'data-color-scheme',
        action.payload
      );
    },
  },
});

export const { toggleThemeMode, setColorScheme } = newThemeSlice.actions;

export default newThemeSlice.reducer;
export { initialState };
