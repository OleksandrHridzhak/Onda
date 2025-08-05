const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const ipcTableHandlers = require(path.join(__dirname, './api/ipcTableHandlers.js'));
const ipcCalendarHandlers = require('./api/ipcCalendarHandlers.js');
const ipcWindowHandlers = require('./api/ipcWindowHandlers.js');
const ipcSettingsHandlers = require('./api/ipcSettingsHandlers.js');

require('dotenv').config();

const { initCronJobs } = require('./services/cronServices');

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
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  if (process.env.NODE_ENV === 'development') {
      mainWindow.loadURL('http://localhost:3000');
  } else {
     mainWindow.loadURL('http://localhost:3000');
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
    ipcCalendarHandlers.init(ipcMain, mainWindow);
    ipcSettingsHandlers.init(ipcMain, mainWindow);
    ipcWindowHandlers.init(ipcMain, mainWindow);
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




// const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu } = require('electron');
// const path = require('path');
// const api = require(path.join(__dirname, './api/api.js'));
// const calendarBackend = require('./api/calendar');

// const { initCronJobs } = require('./services/cronServices');

// let mainWindow;
// let tray = null;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1920,
//     height: 1080,
//     icon: path.join(__dirname, './assets/onda-logo.ico'),
//     frame: false,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js'),
//     },
//   });

//   mainWindow.loadURL('http://localhost:3000');
//   mainWindow.maximize();
// }

// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', () => {
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       if (!mainWindow.isVisible()) mainWindow.show();
//       mainWindow.focus();
//     }
//   });

//   app.whenReady().then(() => {
//     createWindow();
//     api.init(ipcMain, mainWindow);
//     calendarBackend.init(ipcMain, mainWindow);
//     initCronJobs();

//     tray = new Tray(path.join(__dirname, './assets/onda-logo.ico'));
//     const trayMenu = Menu.buildFromTemplate([
//       {
//         label: 'Показати',
//         click: () => {
//           if (mainWindow) {
//             mainWindow.show();
//           }
//         },
//       },
//       {
//         label: 'Вийти',
//         click: () => {
//           app.quit();
//         },
//       },
//     ]);
//     tray.setToolTip('Onda App');
//     tray.setContextMenu(trayMenu);

//     tray.on('click', () => {
//       if (mainWindow) {
//         mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
//       }
//     });
//   });

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     } else {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       if (!mainWindow.isVisible()) mainWindow.show();
//       mainWindow.focus();
//     }
//   });

//   app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//       app.quit();
//     }
//   });
// }
