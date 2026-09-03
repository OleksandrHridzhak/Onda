import { app, ipcMain } from 'electron';
import { initDatabase } from '../core/lib/database';
import { registerAllHandlers } from '../features';
import { createTray } from './tray';
import {
    createWindow,
    focusMainWindow,
    getMainWindow,
} from './window';
import dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
    // Close second instances
    const isFirstInstance = app.requestSingleInstanceLock();
    if (!isFirstInstance) {
        app.quit();
        return;
    }

    // Focus primary instance
    app.on('second-instance', () => {
        focusMainWindow();
    });

    await app.whenReady();
    await initDatabase();

    createWindow();
    createTray();
    registerAllHandlers(ipcMain);

    app.on('activate', () => {
        if (!getMainWindow()) {
            createWindow();
        } else {
            focusMainWindow();
        }
    });
}

main();
