import { configureStore } from '@reduxjs/toolkit';
import { pomodoroReducer } from 'features/Pomodoro';
import { themeReducer } from 'features/ChangeTheme';

export const store = configureStore({
    reducer: {
        pomodoro: pomodoroReducer,
        newTheme: themeReducer,
    },
});

export default store;
