const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipcTableHandlers = require('./api/ipcTableHandlers.js');
const ipcWindowsHandlers = require('./api/ipcWindowsHandlers.js');

require('dotenv').config();


const { initCronJobs } = require('./services/cronServices.js');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, './assets/onda-logo.ico'),
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.bundle.js'),
      webSecurity: false,
    },
  });
  

  console.log('env:', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, './render/build/index.html'));
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
    ipcTableHandlers.init(ipcMain);
    ipcWindowsHandlers.init(ipcMain, mainWindow);
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
