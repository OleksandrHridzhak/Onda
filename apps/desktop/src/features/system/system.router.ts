import type { BrowserWindow, IpcMain } from 'electron';
import { systemController } from './system.controller';

export function registerSystemHandlers(ipcMain: IpcMain, mainWindow: BrowserWindow): void {
    // Database operations
    ipcMain.handle('db:system:clearAllData', systemController.clearAllData);

    // Window operations
    ipcMain.handle('window-close', systemController.closeWindow(mainWindow));
    ipcMain.handle('window-minimize', systemController.minimizeWindow(mainWindow));
    ipcMain.handle('window-maximize', systemController.maximizeWindow(mainWindow));
    ipcMain.handle('show-notification', systemController.showNotification);
    ipcMain.handle('close-app', systemController.closeApp);
}
