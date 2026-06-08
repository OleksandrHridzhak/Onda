import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'node:path';
import { init } from '../ipc/windowHandlers';
import dotenv from 'dotenv';

dotenv.config();

let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: join(__dirname, '../../shared/assets/logo256.ico'),
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.bundle.js'),
        },
    });

    console.log('env:', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        void mainWindow.loadURL('http://localhost:3000');
    } else {
        void mainWindow.loadFile(
            join(__dirname, '../../render/build/index.html'),
        );
    }

    return mainWindow;
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            if (!mainWindow.isVisible()) mainWindow.show();
            mainWindow.focus();
        }
    });

    void app.whenReady().then(() => {
        const window = createWindow();
        init.init(ipcMain, window);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            if (!mainWindow.isVisible()) mainWindow.show();
            mainWindow.focus();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}
