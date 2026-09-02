import { ensureDefaultSettings } from 'features/settings/api/settings';
import {
    getInitialFontFamily,
    normalizeColorScheme,
} from 'features/settings/stores/themeSlice';

export async function initializeApp(): Promise<void> {
    await ensureDefaultSettings();

    const savedTheme = localStorage.getItem('themeMode');
    const savedColor = normalizeColorScheme(
        localStorage.getItem('colorScheme'),
    );
    const savedFont = getInitialFontFamily();

    if (savedTheme) {
        document.documentElement.dataset.themeMode = savedTheme;
    }

    localStorage.setItem('colorScheme', savedColor);
    document.documentElement.dataset.colorScheme = savedColor;
    localStorage.setItem('fontFamily', savedFont);
    document.documentElement.dataset.fontFamily = savedFont;
}
