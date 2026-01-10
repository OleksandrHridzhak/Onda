import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';
import newThemeReducer from './slices/newThemeSlice';

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    newTheme: newThemeReducer,
  },
});

export default store;
