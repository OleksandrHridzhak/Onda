import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { init } from './api/ipcWindowsHandlers.js';
import dotenv from 'dotenv';

dotenv.config();




let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: join(__dirname, './assets/onda-logo.ico'),
    icon: join(__dirname, './assets/onda-logo.ico'),
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.bundle.js'),
      preload: join(__dirname, 'preload.bundle.js'),
      webSecurity: false,
    },
  });

  console.log('env:', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(join(__dirname, './render/build/index.html'));
    mainWindow.loadFile(join(__dirname, './render/build/index.html'));
  }
}

// Enable global shortcuts
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
    init(ipcMain, mainWindow);
    init(ipcMain, mainWindow);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
