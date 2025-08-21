import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';
import themeReducer from './slices/oldthemeSlice';
import tableReducer from './table/tableSlice';
import newThemeSlice from './slices/newThemeSlice'

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    theme: themeReducer,
    table: tableReducer,
    newTheme: newThemeSlice,
  },
});

export default store;
