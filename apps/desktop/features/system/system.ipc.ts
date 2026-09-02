import { app, Notification, type BrowserWindow, type IpcMain } from 'electron';
import type { ElectronNotificationOptions } from '@onda/shared';
import { systemService } from './system.service';
import { notifyDbChanged } from '../../core/events';

export function registerSystemHandlers(ipcMain: IpcMain, mainWindow: BrowserWindow): void {
    // Database system operations
    ipcMain.handle('db:system:clearAllData', async () => {
        const res = await systemService.clearAllData();
        if (res.success) notifyDbChanged({ table: 'all', action: 'clear' });
        return res;
    });

    // Window management handlers
    ipcMain.handle('window-close', () => {
        mainWindow.hide();
    });

    ipcMain.handle('window-minimize', () => {
        mainWindow.minimize();
    });

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
}
