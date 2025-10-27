const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipcTableHandlers = require('./api/ipcTableHandlers.js');
const ipcCalendarHandlers = require('./api/ipcCalendarHandlers.js');
const ipcWindowHandlers = require('./api/ipcWindowHandlers.js');
const ipcSettingsHandlers = require('./api/ipcSettingsHandlers.js');

require('dotenv').config();

const { initCronJobs } = require('./services/cronServices.js');
//TODO create commits rules
//TODO find on the internet how to improve solo dev system

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
      // Allow use of the <webview> tag in renderer
      webviewTag: true,
      webSecurity: false,
      webviewTag: true,
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
    // Remove X-Frame-Options and Content-Security-Policy headers to allow embedding sites in webview
    const { session } = require('electron');
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      const responseHeaders = Object.fromEntries(
        Object.entries(details.responseHeaders).filter(
          (header) =>
            !['x-frame-options', 'content-security-policy'].includes(
              header[0].toLowerCase()
            )
        )
      );
      callback({ responseHeaders });
    });

    createWindow();
    ipcTableHandlers.init(ipcMain);
    ipcCalendarHandlers.init(ipcMain);
    ipcSettingsHandlers.init(ipcMain);
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
