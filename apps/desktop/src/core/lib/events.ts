import { BrowserWindow } from "electron";
import type { DbChangeEvent } from "@onda/shared";

export function notifyDbChanged(event: DbChangeEvent): void {
  const windows = BrowserWindow.getAllWindows();
  for (const win of windows) {
    if (!win.isDestroyed() && !win.webContents.isDestroyed()) {
      win.webContents.send("db:changed", event);
    }
  }
}
