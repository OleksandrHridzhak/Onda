import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import themes from '../../components/utils/theme';

// Фетчимо тему — зараз з localStorage, пізніше можна з Electron
export const fetchTheme = createAsyncThunk('theme/fetchTheme', async () => {
  let storedTheme = localStorage.getItem('theme');
  // Тут можна підключити Electron API:
  // const electronTheme = await window.electronAPI?.getTheme();
  // storedTheme = electronTheme || storedTheme;

  if (!storedTheme) storedTheme = 'peach.light';
  return storedTheme;
});

export const toggleDarkMode = createAsyncThunk(
  'theme/toggleDarkMode',
  async (_, { getState }) => {
    const state = getState();
    const currentMode = state.theme.mode;
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    const color = state.theme.color;

    const newTheme = themes[color][newMode];
    localStorage.setItem('theme', `${color}.${newMode}`);

    return { mode: newMode, theme: newTheme };
  }
);

const [initialColor, initialMode] = (
  localStorage.getItem('theme') || 'peach.light'
).split('.');
const initialTheme =
  themes[initialColor]?.[initialMode] || themes['peach'].light;

const initialState = {
  color: initialColor || 'peach',
  mode: initialMode || 'light',
  theme: initialTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    switchColor: (state, action) => {
      if (themes[action.payload] && themes[action.payload][state.mode]) {
        state.color = action.payload;
        state.theme = themes[state.color][state.mode];
        localStorage.setItem('theme', `${state.color}.${state.mode}`);
      }
    },
    switchMode: (state, action) => {
      if (themes[state.color][action.payload]) {
        state.mode = action.payload;
        state.theme = themes[state.color][state.mode];
        localStorage.setItem('theme', `${state.color}.${state.mode}`);
      }
    },
    toggleMode: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      if (themes[state.color][newMode]) {
        state.mode = newMode;
        state.theme = themes[state.color][state.mode];
        localStorage.setItem('theme', `${state.color}.${state.mode}`);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheme.fulfilled, (state, action) => {
        const [color, mode] = action.payload.split('.');
        state.color = color || 'peach';
        state.mode = mode || 'light';
        state.theme =
          themes[state.color]?.[state.mode] || themes['peach'].light;
      })
      .addCase(toggleDarkMode.fulfilled, (state, action) => {
        state.mode = action.payload.mode;
        state.theme = action.payload.theme;
      });
  },
});

export const { switchColor, switchMode, toggleMode } = themeSlice.actions;
export default themeSlice.reducer;
