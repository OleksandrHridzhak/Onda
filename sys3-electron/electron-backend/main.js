const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const api = require(path.join(__dirname, 'api.js'));
const calendarBackend = require('./calendar');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    frame:false,
    webPreferences: {
      nodeIntegration: false, // Вимкнути для безпеки
      contextIsolation: true, // Увімкнути ізоляцію
      preload: path.join(__dirname, 'preload.js'), // Підключаємо preload
    },
  });

  // Завантажуємо пусту HTML-сторінку (бо фронтенду ще немає)
  //mainWindow.loadFile(path.join(__dirname, './build/index.html'));
  mainWindow.loadURL('http://localhost:3000'); // Завантажуємо локальний сервер React

}

app.whenReady().then(() => {
  createWindow();
  // Ініціалізація API після того, як вікно готове
  api.init(ipcMain, mainWindow);
  calendarBackend.init(ipcMain, mainWindow);
});

console.log('Message from renderer process!');
