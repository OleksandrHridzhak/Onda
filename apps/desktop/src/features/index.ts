import type { BrowserWindow, IpcMain } from 'electron';
import { registerColumnsHandlers } from './columns/columns.router';
import { registerEntriesHandlers } from './entries/entries.router';
import { registerCalendarHandlers } from './calendar/calendar.router';
import { registerSettingsHandlers } from './settings/settings.router';
import { registerSystemHandlers } from './system/system.router';

export function registerAllHandlers(ipcMain: IpcMain, mainWindow: BrowserWindow): void {
    registerColumnsHandlers(ipcMain);
    registerEntriesHandlers(ipcMain);
    registerCalendarHandlers(ipcMain);
    registerSettingsHandlers(ipcMain);
    registerSystemHandlers(ipcMain, mainWindow);
}

