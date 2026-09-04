import { BrowserWindow } from "electron";
import { join } from "path";
import { APP_ICON_ICO_PATH } from "../core/constants";

let mainWindow: BrowserWindow | null = null;

export function createWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: APP_ICON_ICO_PATH,
    backgroundColor: "#111827",
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.bundle.js"),
    },
  });

  mainWindow.maximize();

  if (process.env.NODE_ENV === "development") {
    void mainWindow.loadURL(process.env.DEV_SERVER_URL!);
  } else {
    void mainWindow.loadFile(join(__dirname, "../../render/build/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function focusMainWindow(): void {
  if (!mainWindow) return;

  if (mainWindow.isMinimized()) mainWindow.restore();
  if (!mainWindow.isVisible()) mainWindow.show();
  mainWindow.focus();
}

export function toggleMainWindow(): void {
  if (!mainWindow) return;

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    focusMainWindow();
  }
}
