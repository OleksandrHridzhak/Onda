import type { IpcMain } from "electron";
import { entriesController } from "./entries.controller";

export function registerEntriesHandlers(ipcMain: IpcMain): void {
  ipcMain.handle("db:entries:getDayEntry", entriesController.getDayEntry);
  ipcMain.handle(
    "db:entries:getEntriesForWeek",
    entriesController.getEntriesForWeek,
  );
  ipcMain.handle(
    "db:entries:getEntriesForDateRange",
    entriesController.getEntriesForDateRange,
  );
  ipcMain.handle("db:entries:upsertDayEntry", entriesController.upsertDayEntry);
  ipcMain.handle(
    "db:entries:deleteEntriesForColumn",
    entriesController.deleteEntriesForColumn,
  );
}
