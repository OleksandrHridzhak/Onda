const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const { ensureDataFileExists } = require('../utils/dataUtils');
const DATA_FILE = path.join(__dirname, '../userData/data.json');

const { getColumnTemplates, getSettingsTemplates } = require('../constants/fileTemplates.js');


const CALENDAR_FILE = path.join(__dirname, '../userData/calendar.json');
const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');
const { updateThemeBasedOnTime } = require('../utils/utils');


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
    // Обробник для перемикання теми
    ipcMain.handle('switch-theme', (event, darkMode) => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      let settings;
      try {
        settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      } catch (err) {
        return { status: 'Error parsing settings', error: err.message };
      }

      settings.theme.darkMode = darkMode;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Theme switched', darkMode };
    });

    // Обробник для отримання поточної теми
    ipcMain.handle('get-theme', () => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      try {
        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        return { status: 'Theme fetched', darkMode: settings.theme.darkMode };
      } catch (err) {
        return { status: 'Error parsing settings', error: err.message };
      }
    });

    // Обробник для отримання налаштувань клітинок
    ipcMain.handle('get-cell-settings', () => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      try {
        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        return {
          status: 'Cell settings fetched',
          cellSettings: settings.theme.cellSettings || {}
        };
      } catch (err) {
        return { status: 'Error parsing settings', error: err.message };
      }
    });

    // Обробник для оновлення налаштувань клітинки
    ipcMain.handle('update-cell-settings', async (event, cellId, newSettings) => {
      try {
        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));
        if (!settings.theme.cellSettings) {
          settings.theme.cellSettings = {};
        }
        settings.theme.cellSettings[cellId] = {
          width: newSettings.width,
          height: newSettings.height,
          order: newSettings.order
        };
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
        return { status: 'success' };
      } catch (err) {
        console.error('Error saving cell settings:', err);
        return { status: 'error', message: err.message };
      }
    });

    // Обробник для видалення налаштувань клітинки
    ipcMain.handle('delete-cell-settings', (event, cellId) => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      let settings;
      try {
        settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      } catch (err) {
        return { status: 'Error parsing settings', error: err.message };
      }

      if (settings.theme.cellSettings && settings.theme.cellSettings[cellId]) {
        delete settings.theme.cellSettings[cellId];
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
        return { status: 'Cell settings deleted', cellId };
      }

      return { status: 'Cell settings not found', cellId };
    });

    // Обробник для отримання налаштувань
    ipcMain.handle('get-settings', () => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      return { status: 'Settings fetched', data: settings };
    });

    // Обробник для оновлення налаштувань
    ipcMain.handle('update-settings', (event, settings) => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Settings updated' };
    });

    // Обробник для оновлення теми
    ipcMain.handle('update-theme', (event, themeSettings) => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.theme = { ...settings.theme, ...themeSettings };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      updateThemeBasedOnTime();
      return { status: 'Theme updated' };
    });

    // Обробник для оновлення налаштувань таблиці
    ipcMain.handle('update-table-settings', (event, tableSettings) => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.table = { ...settings.table, ...tableSettings };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Table settings updated' };
    });

    // Обробник для оновлення UI налаштувань
    ipcMain.handle('update-ui-settings', (event, uiSettings) => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.ui = { ...settings.ui, ...uiSettings };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'UI settings updated' };
    });

    // Обробник для оновлення порядку колонок
    ipcMain.handle('update-column-order', (event, columnOrder) => {
      ensureDataFileExists(SETTINGS_FILE, () => getSettingsTemplates());
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.table.columnOrder = columnOrder;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Column order updated' };
    });

    // Обробник для показу системного повідомлення
    ipcMain.handle('show-notification', (event, { title, body }) => {
      new Notification({ title, body }).show();
    });

    // Обробник для експорту даних
    ipcMain.handle('export-data', async () => {
      try {
        const [data, calendarData, settings] = await Promise.all([
          getData(DATA_FILE),
          getData(CALENDAR_FILE),
          getData(SETTINGS_FILE, getSettingsTemplates)
        ]);

        const exportData = {
          data,
          calendar: calendarData,
          settings
        };

        const { filePath } = await dialog.showSaveDialog({
          title: 'Експорт даних',
          defaultPath: path.join(app.getPath('documents'), 'onda-data.json'),
          filters: [{ name: 'JSON Files', extensions: ['json'] }]
        });

        if (!filePath) {
          return { status: 'Export cancelled' };
        }

        await fs.promises.writeFile(filePath, JSON.stringify(exportData, null, 2));
        return { status: 'Data exported', filePath };
      } catch (error) {
        console.error('Помилка при експорті даних:', error);
        return { status: 'Export failed', error: error.message };
      }
    });

    // Обробник для імпорту даних
    ipcMain.handle('import-data', async () => {
      try {
        const { filePaths } = await dialog.showOpenDialog({
          title: 'Імпорт даних',
          defaultPath: app.getPath('documents'),
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
          properties: ['openFile']
        });

        if (!filePaths || filePaths.length === 0) {
          return { status: 'Import cancelled' };
        }

        const fileContent = await fs.promises.readFile(filePaths[0], 'utf8');
        const importData = JSON.parse(fileContent);

        if (importData.data) {
          await saveData(DATA_FILE, importData.data);
        }
        if (importData.calendar) {
          await saveCalendarData(CALENDAR_FILE,importData.calendar);
        }
        if (importData.settings) {
          await saveSettings(SETTINGS_FILE,importData.settings);
        }

        return { status: 'Data imported' };
      } catch (error) {
        console.error('Помилка при імпорті даних:', error);
        return { status: 'Import failed', error: error.message };
      }
    });
  }
};