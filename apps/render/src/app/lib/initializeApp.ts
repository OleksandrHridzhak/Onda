import { db } from 'shared/api/db';
import { ensureDefaultSettings } from 'entities/Settings';
import {
    getInitialFontFamily,
    normalizeColorScheme,
} from 'features/ChangeTheme';

export async function initializeApp(): Promise<void> {
    await db.open();
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
