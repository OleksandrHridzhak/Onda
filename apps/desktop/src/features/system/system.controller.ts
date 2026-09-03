import { app, Notification, type BrowserWindow, type IpcMainInvokeEvent } from 'electron';
import type { ElectronNotificationOptions } from '@onda/shared';
import { clearAllData } from './services/clear-all-data';
import { notifyDbChanged } from '../../core/events';

export const systemController = {
    async clearAllData() {
        const res = await clearAllData();
        if (res.success) notifyDbChanged({ table: 'all', action: 'clear' });
        return res;
    },

    closeWindow(mainWindow: BrowserWindow) {
        return () => {
            mainWindow.hide();
        };
    },

    minimizeWindow(mainWindow: BrowserWindow) {
        return () => {
            mainWindow.minimize();
        };
    },

    maximizeWindow(mainWindow: BrowserWindow) {
        return () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            } else {
                mainWindow.maximize();
            }
        };
    },

    showNotification(_e: IpcMainInvokeEvent, { title, body }: ElectronNotificationOptions) {
        new Notification({ title, body }).show();
    },

    closeApp() {
        app.quit();
    },
};
