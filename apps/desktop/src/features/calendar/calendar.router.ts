import type { IpcMain } from 'electron';
import { calendarController } from './calendar.controller';

export function registerCalendarHandlers(ipcMain: IpcMain): void {
    ipcMain.handle('db:calendar:getAll', calendarController.getAll);
    ipcMain.handle('db:calendar:getByDate', calendarController.getByDate);
    ipcMain.handle('db:calendar:getById', calendarController.getById);
    ipcMain.handle('db:calendar:getInRange', calendarController.getInRange);
    ipcMain.handle('db:calendar:create', calendarController.create);
    ipcMain.handle('db:calendar:update', calendarController.update);
    ipcMain.handle('db:calendar:save', calendarController.save);
    ipcMain.handle('db:calendar:delete', calendarController.delete);
}
