import type { IpcMain } from "electron";
import { settingsController } from "./settings.controller";

export function registerSettingsHandlers(ipcMain: IpcMain): void {
  ipcMain.handle("db:settings:get", settingsController.get);
  ipcMain.handle("db:settings:update", settingsController.update);
}
