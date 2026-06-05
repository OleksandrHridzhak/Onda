import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let themeSwitchTimeoutId: number | null = null;

const applyThemeSwitchTransition = () => {
    const root = document.documentElement;

    root.classList.add('theme-switching');

    if (themeSwitchTimeoutId !== null) {
        window.clearTimeout(themeSwitchTimeoutId);
    }

    themeSwitchTimeoutId = window.setTimeout(() => {
        root.classList.remove('theme-switching');
        themeSwitchTimeoutId = null;
    }, 180);
};

export interface ThemeState {
    colorScheme: string;
    themeMode: 'light' | 'dark';
}

export const initialState: ThemeState = {
    colorScheme: localStorage.getItem('colorScheme') || 'standard',
    themeMode:
        (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
};

const newThemeSlice = createSlice({
    name: 'newTheme',
    initialState,
    reducers: {
        toggleThemeMode: (state) => {
            applyThemeSwitchTransition();
            const nextMode = state.themeMode === 'light' ? 'dark' : 'light';
            state.themeMode = nextMode;
            localStorage.setItem('themeMode', nextMode);
            document.documentElement.dataset.themeMode = nextMode;
        },
        setColorScheme: (state, action: PayloadAction<string>) => {
            state.colorScheme = action.payload;
            localStorage.setItem('colorScheme', action.payload);
            document.documentElement.dataset.colorScheme = action.payload;
        },
    },
});

export const { toggleThemeMode, setColorScheme } = newThemeSlice.actions;

export default newThemeSlice.reducer;
