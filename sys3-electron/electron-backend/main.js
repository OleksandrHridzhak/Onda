const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const api = require(path.join(__dirname, './api/api.js'));
const calendarBackend = require('./api/calendar');

const { initCronJobs } = require('./services/cronServices');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, './assets/onda-logo.png'),
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

// Завантажуємо пусту HTML-сторінку (бо фронтенду ще немає)
  //mainWindow.loadFile(path.join(__dirname, './build/index.html'));
  mainWindow.loadURL('http://localhost:3000'); // Завантажуємо локальний сервер React
  mainWindow.maximize();

}

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
    api.init(ipcMain, mainWindow);
    calendarBackend.init(ipcMain, mainWindow);
    initCronJobs();
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