import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  colorScheme: string;
  themeMode: 'light' | 'dark' | string;
}

export const initialState: ThemeState = {
  colorScheme: localStorage.getItem('colorScheme') || 'standard',
  themeMode: (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
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
    setColorScheme: (state, action: PayloadAction<string>) => {
      state.colorScheme = action.payload;
      localStorage.setItem('colorScheme', action.payload);
      document.documentElement.setAttribute(
        'data-color-scheme',
        action.payload,
      );
    },
  },
});

export const { toggleThemeMode, setColorScheme } = newThemeSlice.actions;

export default newThemeSlice.reducer;
