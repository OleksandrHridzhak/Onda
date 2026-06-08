import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { init } from '../ipc/windowHandlers';
import { createTray } from './tray';
import { focusWindow } from './window';
import dotenv from 'dotenv';

dotenv.config();

let mainWindow: BrowserWindow | null = null;
const iconPath = join(__dirname, '../../shared/assets/logo256.ico');

// Create the main application window
function createWindow(): BrowserWindow {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: iconPath,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.bundle.js'),
        },
    });

    mainWindow.maximize();

    if (process.env.NODE_ENV === 'development') {
        void mainWindow.loadURL(process.env.DEV_SERVER_URL!);
    } else {
        void mainWindow.loadFile(
            join(__dirname, '../../render/build/index.html'),
        );
    }

    return mainWindow;
}

// Ensure only a single instance of the application is running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        focusWindow(mainWindow);
    });

    void app.whenReady().then(() => {
        const window = createWindow();
        createTray({
            iconPath: iconPath,
            getMainWindow: () => mainWindow,
            onQuit: () => app.quit(),
        });
        init.init(ipcMain, window);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else {
            focusWindow(mainWindow);
        }
    });
}
