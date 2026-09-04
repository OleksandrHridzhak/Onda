import {
  app,
  BrowserWindow,
  Notification,
  type IpcMainInvokeEvent,
} from "electron";
import type { ElectronNotificationOptions } from "@onda/shared";
import { clearAllData } from "./services/clear-all-data";
import { notifyDbChanged } from "../../core/lib/events";
import { getMainWindow } from "../../main/window";

export const systemController = {
  async clearAllData() {
    const res = await clearAllData();
    if (res.success) notifyDbChanged({ table: "all", action: "clear" });
    return res;
  },

  closeWindow(e: IpcMainInvokeEvent) {
    const window = BrowserWindow.fromWebContents(e.sender) || getMainWindow();
    window?.hide();
  },

  minimizeWindow(e: IpcMainInvokeEvent) {
    const window = BrowserWindow.fromWebContents(e.sender) || getMainWindow();
    window?.minimize();
  },

  maximizeWindow(e: IpcMainInvokeEvent) {
    const window = BrowserWindow.fromWebContents(e.sender) || getMainWindow();
    if (!window) return;
    if (window.isMaximized()) {
      window.restore();
    } else {
      window.maximize();
    }
  },

  showNotification(
    _e: IpcMainInvokeEvent,
    { title, body }: ElectronNotificationOptions,
  ) {
    new Notification({ title, body }).show();
  },

  closeApp() {
    app.quit();
  },
};
