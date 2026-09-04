import type { IpcMain } from "electron";
import { systemController } from "./system.controller";

export function registerSystemHandlers(ipcMain: IpcMain): void {
  // Database operations
  ipcMain.handle("db:system:clearAllData", systemController.clearAllData);

  // Window operations
  ipcMain.handle("window-close", systemController.closeWindow);
  ipcMain.handle("window-minimize", systemController.minimizeWindow);
  ipcMain.handle("window-maximize", systemController.maximizeWindow);
  ipcMain.handle("show-notification", systemController.showNotification);
  ipcMain.handle("close-app", systemController.closeApp);
}
