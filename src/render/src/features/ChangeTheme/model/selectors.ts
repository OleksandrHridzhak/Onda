import type { ThemeState } from './themeSlice';

interface ThemeRootState {
    newTheme: ThemeState;
}

export const selectTheme = (state: ThemeRootState): ThemeState =>
    state.newTheme;

export const selectThemeMode = (
    state: ThemeRootState,
): ThemeState['themeMode'] => state.newTheme.themeMode;

export const selectColorScheme = (
    state: ThemeRootState,
): ThemeState['colorScheme'] => state.newTheme.colorScheme;
