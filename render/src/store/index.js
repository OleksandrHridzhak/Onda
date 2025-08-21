import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';
import tableReducer from './table/tableSlice';
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    theme: themeReducer,
    table: tableReducer,
  },
});

export default store;
