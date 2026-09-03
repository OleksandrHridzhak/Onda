import { app, Menu, Tray, nativeImage } from 'electron';
import { focusMainWindow, toggleMainWindow } from './window';
import { APP_NAME, APP_ICON_ICO_PATH } from '../core/constants';

let tray: Tray | null = null;

export function createTray(): void {
    tray = new Tray(nativeImage.createFromPath(APP_ICON_ICO_PATH));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Open ${APP_NAME}`,
            click: () => focusMainWindow(),
        },
        {
            label: 'Quit',
            click: () => app.quit(),
        },
    ]);

    tray.setToolTip(APP_NAME);
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        toggleMainWindow();
    });
}
