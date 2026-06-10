import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let themeSwitchTimeoutId: number | null = null;

export const normalizeColorScheme = (colorScheme: string | null): string =>
    colorScheme || 'standard';

export const getInitialFontFamily = (): string =>
    localStorage.getItem('fontFamily') || 'poppins';

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
    fontFamily: string;
    themeMode: 'light' | 'dark';
}

export const initialState: ThemeState = {
    colorScheme: normalizeColorScheme(localStorage.getItem('colorScheme')),
    fontFamily: getInitialFontFamily(),
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
        setFontFamily: (state, action: PayloadAction<string>) => {
            state.fontFamily = action.payload;
            localStorage.setItem('fontFamily', action.payload);
            document.documentElement.dataset.fontFamily = action.payload;
        },
    },
});

export const { toggleThemeMode, setColorScheme, setFontFamily } =
    newThemeSlice.actions;

export default newThemeSlice.reducer;
