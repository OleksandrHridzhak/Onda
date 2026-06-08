import { app, Notification, type BrowserWindow, type IpcMain } from 'electron';
import type { ElectronNotificationOptions } from '../../shared/types/electron';

const ipcWindowsHandlers = {
    init(ipcMain: IpcMain, mainWindow: BrowserWindow): void {
        // Window close handler
        ipcMain.handle('window-close', () => {
            mainWindow.hide();
        });

        // Window minimize handler
        ipcMain.handle('window-minimize', () => {
            mainWindow.minimize();
        });

        // Window maximize handler OR restore WINDOW
        ipcMain.handle('window-maximize', () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            } else {
                mainWindow.maximize();
            }
        });

        // Notification handler
        ipcMain.handle(
            'show-notification',
            (_event, { title, body }: ElectronNotificationOptions) => {
                new Notification({ title, body }).show();
            },
        );
        // App close handler
        ipcMain.handle('close-app', () => {
            app.quit();
        });
    },
};

export { ipcWindowsHandlers as init };
