import { Menu, Tray, nativeImage, type BrowserWindow } from 'electron';
import { focusWindow } from './window';

interface CreateTrayOptions {
    iconPath: string;
    getMainWindow: () => BrowserWindow | null;
    onQuit: () => void;
}

let tray: Tray | null = null;

export function createTray({
    iconPath,
    getMainWindow,
    onQuit,
}: CreateTrayOptions): void {
    tray = new Tray(nativeImage.createFromPath(iconPath));

    tray.setToolTip('ONDA');
    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                label: 'Open ONDA',
                click: () => focusWindow(getMainWindow()),
            },
            {
                label: 'Quit',
                click: onQuit,
            },
        ]),
    );

    tray.on('click', () => {
        const mainWindow = getMainWindow();

        if (!mainWindow) return;

        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            focusWindow(mainWindow);
        }
    });
}
