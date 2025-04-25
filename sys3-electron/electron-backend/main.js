const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const api = require(path.join(__dirname, 'api.js'));
const calendarBackend = require('./calendar');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920, // Typical maximum width for a screen
    height: 1080, // Typical maximum heig
    frame: false,
    webPreferences: {
      nodeIntegration: false, // Вимкнути для безпеки
      contextIsolation: true, // Увімкнути ізоляцію
      preload: path.join(__dirname, 'preload.js'), // Підключаємо preload
    },
  });

  // Завантажуємо пусту HTML-сторінку (бо фронтенду ще немає)
  //mainWindow.loadFile(path.join(__dirname, './build/index.html'));
  mainWindow.loadURL('http://localhost:3000'); // Завантажуємо локальний сервер React

  // Set the window to full screen
  mainWindow.maximize();
}

app.whenReady().then(() => {
  createWindow();
  // Ініціалізація API після того, як вікно готове
  api.init(ipcMain, mainWindow);
  calendarBackend.init(ipcMain, mainWindow);
});

console.log('Message from renderer process!');
