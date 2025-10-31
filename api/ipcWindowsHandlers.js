const { app, Notification} = require('electron');
module.exports = {
  init(ipcMain, mainWindow) {
    // Window close handler
    ipcMain.handle('window-close', () => {
      mainWindow.hide();
    });

    //WIndow minimize handler
    ipcMain.handle('window-minimize', () => {
      mainWindow.minimize();
    });

    // Window maximize handler OR restore WINDOW
    ipcMain.handle('window-maximize', () => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    });

    // Tab navigation handlers
    ipcMain.on('next-tab', () => {
      mainWindow.webContents.send('next-tab');
    });
    // Notification handler
    ipcMain.handle('show-notification', (event, { title, body }) => {
      new Notification({ title, body }).show();
    });
    // App close handler
    ipcMain.handle('close-app', () => {
      app.quit();
    });
  },
};
