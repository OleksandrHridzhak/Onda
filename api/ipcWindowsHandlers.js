const { app, Notification } = require('electron');

/**
 * IPC handlers for window management operations
 */
module.exports = {
  /**
   * Initializes IPC handlers for window operations
   * @param {Electron.IpcMain} ipcMain - The IPC main process instance
   * @param {Electron.BrowserWindow} mainWindow - The main application window
   */
  init(ipcMain, mainWindow) {
    /**
     * Hides the window (instead of closing)
     */
    ipcMain.handle('window-close', () => {
      mainWindow.hide();
    });

    /**
     * Minimizes the window
     */
    ipcMain.handle('window-minimize', () => {
      mainWindow.minimize();
    });

    /**
     * Toggles window maximize/restore state
     */
    ipcMain.handle('window-maximize', () => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    });

    /**
     * Handles tab navigation
     */
    ipcMain.on('next-tab', () => {
      mainWindow.webContents.send('next-tab');
    });

    /**
     * Shows a system notification
     * @param {Object} event - IPC event
     * @param {Object} notification - Notification data
     * @param {string} notification.title - Notification title
     * @param {string} notification.body - Notification body
     */
    ipcMain.handle('show-notification', (event, { title, body }) => {
      new Notification({ title, body }).show();
    });

    /**
     * Quits the application
     */
    ipcMain.handle('close-app', () => {
      app.quit();
    });
  },
};
