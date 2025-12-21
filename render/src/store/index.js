import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';
import newThemeReducer from './slices/newThemeSlice';
import tableDataReducer from './tableSlice/tableSlice';
import { tablePersistMiddleware } from './tableSlice/persistMiddleware';

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    tableData: tableDataReducer,
    newTheme: newThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tablePersistMiddleware),
});

export default store;
