import type { IpcMain } from "electron";
import { calendarController } from "./calendar.controller";

export function registerCalendarHandlers(ipcMain: IpcMain): void {
  ipcMain.handle("db:calendar:getAll", calendarController.getAll);
  ipcMain.handle("db:calendar:save", calendarController.save);
  ipcMain.handle("db:calendar:delete", calendarController.delete);
}
