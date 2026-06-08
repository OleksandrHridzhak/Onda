import type { BrowserWindow } from 'electron';

export function focusWindow(window: BrowserWindow | null): void {
    if (!window) return;

    if (window.isMinimized()) window.restore();
    if (!window.isVisible()) window.show();
    window.focus();
}
