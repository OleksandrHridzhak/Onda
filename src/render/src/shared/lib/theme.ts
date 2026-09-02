import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export function useDocumentThemeMode(): ThemeMode {
    const readThemeMode = (): ThemeMode =>
        document.documentElement.dataset.themeMode === 'dark'
            ? 'dark'
            : 'light';

    const [themeMode, setThemeMode] = useState<ThemeMode>(readThemeMode);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setThemeMode(readThemeMode());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme-mode'],
        });

        return () => observer.disconnect();
    }, []);

    return themeMode;
}
