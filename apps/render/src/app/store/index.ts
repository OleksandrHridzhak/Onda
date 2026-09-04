import { configureStore } from '@reduxjs/toolkit';
import themeReducer from 'features/settings/stores/themeSlice';

export const store = configureStore({
    reducer: {
        newTheme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
