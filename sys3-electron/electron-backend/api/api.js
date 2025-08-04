const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const { ensureDataFileExists } = require('../utils/dataUtils');
const DATA_FILE = path.join(__dirname, '../userData/data.json');

const { getColumnTemplates, getSettingsTemplates } = require('../constants/fileTemplates.js');



const CALENDAR_FILE = path.join(__dirname, '../userData/calendar.json');
const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');
const { updateThemeBasedOnTime } = require('../utils/utils');
const { get } = require('http');


// Function to get users data from JSON FILES 
const getData = async (filePath, getDefaultData = null) => {
  try {
    ensureDataFileExists(filePath, getDefaultData);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Помилка при читанні файлу ${filePath}:`, error);
    return Array.isArray(getDefaultData?.()) ? [] : null;
  }
};
// Function to save users data to JSON FILES 
const saveData = async (filePath, data) => {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Помилка при збереженні даних:`, error);
    return false;
  }
};

module.exports = {
  init(ipcMain, mainWindow) {
    // Save data to data.json
    ipcMain.handle('save-data', (event, data) => {
      ensureDataFileExists(DATA_FILE);
      saveData(DATA_FILE, data);
      return { status: 'Data saved!' };
    });
    // Get current time
    ipcMain.handle('get-time', () => {
      const now = new Date();
      return { time: now.toISOString() };
    });

    // Обробник для отримання всіх даних із data.json
    ipcMain.handle('get-all-days', async() => {
      try {
        ensureDataFileExists(DATA_FILE);
        const data = await getData(DATA_FILE);
        return { status: 'Data fetched', data };
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }
    });

    // Обробник для оновлення колонки у data.json
    ipcMain.handle('column-change', async (event, updatedColumn) => {
      ensureDataFileExists(DATA_FILE);
      const data = await getData(DATA_FILE);

      const index = data.findIndex(
        (item) => item.ColumnId === updatedColumn.ColumnId
      );

      if (index === -1) {
        return { status: 'Column not found' };
      }

      data[index] = updatedColumn;
      await saveData(DATA_FILE, data);
      return { status: 'Column updated', data: updatedColumn };
    });

    // Обробник для створення компонента
    ipcMain.handle('create-component', async(event, type) => {

      const templates = getColumnTemplates();
      if (!templates[type]) {
        return { status: 'Invalid type', error: `No template for type "${type}"` };
      }

      const newComponent = templates[type];

      ensureDataFileExists(DATA_FILE);
      try {
        data = await getData(DATA_FILE);
      } catch (err) {
        return { status: 'Error parsing file', error: err.message };
      }

      data.push(newComponent);
      await saveData(DATA_FILE, data);
      return { status: 'Success', data: newComponent };
    });

    // Обробник для видалення компонента
    ipcMain.handle('delete-component', (event, columnId) => {
      ensureDataFileExists(DATA_FILE);
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }

      const initialLength = data.length;
      data = data.filter((item) => item.ColumnId !== columnId);

      if (data.length === initialLength) {
        return { status: 'Component not found', columnId };
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return { status: 'Component deleted', columnId };
    });

    // Обробник для закриття вікна
    ipcMain.handle('window-close', () => {
      mainWindow.hide();
    });

    // Обробник для мінімізації вікна
    ipcMain.handle('window-minimize', () => {
      mainWindow.minimize();
    });

    // Обробник для максимізації/відновлення вікна
    ipcMain.handle('window-maximize', () => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    });

    // Обробник для перемикання вкладок
    ipcMain.on('next-tab', () => {
      mainWindow.webContents.send('next-tab');
    });

  }
};