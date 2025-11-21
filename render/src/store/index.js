import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';
import themeReducer from './slices/themeSlice';
import newThemeReducer from './slices/newThemeSlice';
import tableReducer from './table/tableSlice';

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    theme: themeReducer,
    table: tableReducer,
    newTheme: newThemeReducer,
  },
});

export default store;
