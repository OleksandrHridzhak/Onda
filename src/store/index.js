import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './slices/pomodoroSlice';

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
  },
});

export default store; 