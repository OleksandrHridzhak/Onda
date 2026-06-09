import { db } from 'shared/api/db';
import { ensureDefaultSettings } from 'entities/Settings';

export async function initializeApp(): Promise<void> {
    await db.open();
    await ensureDefaultSettings();

    const savedTheme = localStorage.getItem('themeMode');
    const savedColor = localStorage.getItem('colorScheme');

    if (savedTheme) {
        document.documentElement.dataset.themeMode = savedTheme;
    }

    if (savedColor) {
        document.documentElement.dataset.colorScheme = savedColor;
    }
}
