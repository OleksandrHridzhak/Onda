import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    theme: themeReducer,
  },
});

export default store;
