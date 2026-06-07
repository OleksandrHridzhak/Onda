import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from 'app/store/slices/pomodoroSlice';
import newThemeReducer from 'app/store/slices/newThemeSlice';

export const store = configureStore({
    reducer: {
        pomodoro: pomodoroReducer,
        newTheme: newThemeReducer,
    },
});

export default store;
