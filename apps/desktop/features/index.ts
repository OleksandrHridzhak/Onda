import type { BrowserWindow, IpcMain } from 'electron';
import { registerPlannerHandlers } from './planner';
import { registerCalendarHandlers } from './calendar';
import { registerSettingsHandlers } from './settings';
import { registerSystemHandlers } from './system';

export * from './planner';
export * from './calendar';
export * from './settings';
export * from './system';

export function registerAllHandlers(ipcMain: IpcMain, mainWindow: BrowserWindow): void {
    registerPlannerHandlers(ipcMain);
    registerCalendarHandlers(ipcMain);
    registerSettingsHandlers(ipcMain);
    registerSystemHandlers(ipcMain, mainWindow);
}
