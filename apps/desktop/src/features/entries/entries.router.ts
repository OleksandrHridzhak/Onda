import type { IpcMain } from "electron";
import { entriesController } from "./entries.controller";

export function registerEntriesHandlers(ipcMain: IpcMain): void {
  ipcMain.handle(
    "db:entries:getEntriesForWeek",
    entriesController.getEntriesForWeek,
  );
  ipcMain.handle(
    "db:entries:getEntriesForDateRange",
    entriesController.getEntriesForDateRange,
  );
  ipcMain.handle("db:entries:upsertDayEntry", entriesController.upsertDayEntry);
}
