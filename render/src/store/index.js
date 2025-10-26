import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';
import themeReducer from './slices/themeSlice';
import newThemeReducer from './slices/newThemeSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    theme: themeReducer,
    newTheme: newThemeReducer,
    settings: settingsReducer,
  },
});

export default store;
