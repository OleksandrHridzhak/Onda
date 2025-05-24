const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');

const DATA_FILE = path.join(__dirname, '../userData/data.json');
const CALENDAR_FILE = path.join(__dirname, '../userData/calendar.json');
const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');
const { updateThemeBasedOnTime } = require('../utils/utils');

// Функція для перевірки та створення файлу data.json, якщо його немає
const ensureDataFileExists = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

// Функція для перевірки та створення файлу settings.json, якщо його немає
const ensureSettingsFileExists = () => {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
      theme: {
        darkMode: false,
        accentColor: 'blue',
        autoThemeSettings: {
          enabled: false,
          startTime: '08:00',
          endTime: '20:00'
        }
      },
      table: {
        columnOrder: [],
        showSummaryRow: false,
        compactMode: false,
        stickyHeader: true
      },
      ui: {
        animations: true,
        tooltips: true,
        confirmDelete: true
      }
    }, null, 2));
  }
};

const getData = async () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = await fs.promises.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Помилка при читанні даних:', error);
    return [];
  }
};

// Функція для збереження даних
const saveData = async (data) => {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Помилка при збереженні даних:', error);
    return false;
  }
};

// Функція для отримання даних календаря
const getCalendarData = async () => {
  try {
    if (!fs.existsSync(CALENDAR_FILE)) {
      return [];
    }
    const data = await fs.promises.readFile(CALENDAR_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Помилка при читанні даних календаря:', error);
    return [];
  }
};

// Функція для збереження даних календаря
const saveCalendarData = async (data) => {
  try {
    await fs.promises.writeFile(CALENDAR_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Помилка при збереженні даних календаря:', error);
    return false;
  }
};

// Функція для отримання налаштувань
const getSettings = async () => {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return {
        theme: {
          darkMode: false,
          accentColor: 'blue'
        },
        table: {
          columnOrder: [],
          showSummaryRow: false,
          compactMode: false,
          stickyHeader: true
        },
        ui: {
          animations: true,
          tooltips: true,
          confirmDelete: true
        }
      };
    }
    const data = await fs.promises.readFile(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Помилка при читанні налаштувань:', error);
    return null;
  }
};

// Функція для збереження налаштувань
const saveSettings = async (settings) => {
  try {
    await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Помилка при збереженні налаштувань:', error);
    return false;
  }
};

module.exports = {
  init(ipcMain, mainWindow) {
    // Обробник для отримання даних із data.json
    ipcMain.handle('get-data', () => {
      ensureDataFileExists();
      return JSON.parse(fs.readFileSync(DATA_FILE));
    });

    // Обробник для отримання поточного часу
    ipcMain.handle('get-time', () => {
      const now = new Date();
      return { time: now.toISOString() };
    });

    // Обробник для збереження даних у data.json
    ipcMain.handle('save-data', (event, data) => {
      ensureDataFileExists();
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return { status: 'Data saved!' };
    });

    // Обробник для отримання всіх даних із data.json
    ipcMain.handle('get-all-days', () => {
      ensureDataFileExists();
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      try {
        const data = JSON.parse(fileContent);
        return { status: 'Data fetched', data };
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }
    });

    // Обробник для оновлення колонки у data.json
    ipcMain.handle('column-change', (event, updatedColumn) => {
      ensureDataFileExists();
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }

      const index = data.findIndex(
        (item) => item.ColumnId === updatedColumn.ColumnId
      );

      if (index === -1) {
        return { status: 'Column not found' };
      }

      data[index] = updatedColumn;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return { status: 'Column updated', data: updatedColumn };
    });

    // Обробник для створення компонента у data.json
    ipcMain.handle('create-component', (event, type) => {
      const templates = {
        todo: {
          ColumnId: Date.now().toString(),
          Type: 'todo',
          Name: 'Todo List',
          Description: 'Todo list created on backend',
          EmojiIcon: 'ListTodo',
          NameVisible: true,
          Chosen: {
            global: [] // Масив для зберігання todo-елементів
          },
        },
        checkbox: {
          ColumnId: Date.now().toString(),
          Type: 'checkbox',
          Name: 'New Checkbox',
          Description: 'Checkbox created on backend',
          EmojiIcon: 'Star',
          NameVisible: true,
          Chosen: {
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
            Sunday: false,
          },
        },
        numberbox: {
          ColumnId: Date.now().toString(),
          Type: 'numberbox',
          Name: 'New Numberbox',
          Description: 'Numberbox created on backend',
          EmojiIcon: 'Star',
          NameVisible: true,
          Chosen: {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0,
          },
        },
        text: {
          ColumnId: Date.now().toString(),
          Type: 'text',
          Name: 'New Text',
          Description: 'Text created on backend',
          EmojiIcon: 'Star',
          NameVisible: true,
          Chosen: {
            Monday: '',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: '',
            Sunday: '',
          },
        },
        'multi-select': {
          ColumnId: Date.now().toString(),
          Type: 'multi-select',
          Name: 'New Multi-Select',
          Description: 'Multi-select created on backend',
          EmojiIcon: 'Star',
          NameVisible: true,
          Options: ['Option 1', 'Option 2'],
          TagColors: {
            'Option 1': 'blue',
            'Option 2': 'green'
          },
          Chosen: {
            Monday: '',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: '',
            Sunday: '',
          },
        },
        multicheckbox: {
          ColumnId: Date.now().toString(),
          Type: 'multicheckbox',
          Name: 'New Multi Checkbox',
          Description: 'Multi-checkbox created on backend',
          EmojiIcon: 'Circle',
          NameVisible: true,
          Options: ['Task 1', 'Task 2'],
          TagColors: {
            'Task 1': 'blue',
            'Task 2': 'green'
          },
          Chosen: {
            Monday: '',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: '',
            Sunday: '',
          },
        },
      };

      if (!templates[type]) {
        return { status: 'Invalid type', error: `No template for type "${type}"` };
      }

      const newComponent = templates[type];

      ensureDataFileExists();
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (err) {
        return { status: 'Error parsing file', error: err.message };
      }

      data.push(newComponent);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return { status: 'Success', data: newComponent };
    });

    // Обробник для видалення компонента з data.json
    ipcMain.handle('delete-component', (event, columnId) => {
      ensureDataFileExists();
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

    ipcMain.on('next-tab', () => {
      // Відправляємо подію до рендер-процесу, щоб перемкнути вкладку
      mainWindow.webContents.send('next-tab');
    });

    // Обробник для перемикання теми
    ipcMain.handle('switch-theme', (event, darkMode) => {
      ensureSettingsFileExists();
      let settings;
      try {
        settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      } catch (err) {
        return { status: 'Error parsing settings', error: err.message };
      }

      settings.theme.darkMode = darkMode; // Оновлюємо значення darkMode
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Theme switched', darkMode };
    });

    // Обробник для отримання поточної теми
    ipcMain.handle('get-theme', () => {
      ensureSettingsFileExists();
      try {
        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        return { status: 'Theme fetched', darkMode: settings.theme.darkMode };
      } catch (err) {
        return { status: 'Error parsing settings', error: err.message };
      }
    });

    ipcMain.handle('get-cell-settings', () => {
      ensureSettingsFileExists();
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
        
        // Ініціалізуємо cellSettings, якщо їх немає
        if (!settings.theme.cellSettings) {
          settings.theme.cellSettings = {};
        }
        
        // Запобігаємо рекурсії - створюємо плоский об'єкт
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
      ensureSettingsFileExists();
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
      ensureSettingsFileExists();
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      return { status: 'Settings fetched', data: settings };
    });

    // Обробник для оновлення налаштувань
    ipcMain.handle('update-settings', (event, settings) => {
      ensureSettingsFileExists();
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Settings updated' };
    });

    // Обробник для оновлення теми
    ipcMain.handle('update-theme', (event, themeSettings) => {
      ensureSettingsFileExists();
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.theme = { ...settings.theme, ...themeSettings };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      updateThemeBasedOnTime();
      return { status: 'Theme updated' };
    });

    // Обробник для оновлення налаштувань таблиці
    ipcMain.handle('update-table-settings', (event, tableSettings) => {
      ensureSettingsFileExists();
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.table = { ...settings.table, ...tableSettings };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Table settings updated' };
    });

    // Обробник для оновлення UI налаштувань
    ipcMain.handle('update-ui-settings', (event, uiSettings) => {
      ensureSettingsFileExists();
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.ui = { ...settings.ui, ...uiSettings };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'UI settings updated' };
    });

    // Обробник для оновлення порядку колонок
    ipcMain.handle('update-column-order', (event, columnOrder) => {
      ensureSettingsFileExists();
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings.table.columnOrder = columnOrder;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { status: 'Column order updated' };
    });

    // Обробник для показу системного повідомлення
    ipcMain.handle('show-notification', (event, { title, body }) => {
      new Notification({ title, body }).show();
    });

    // Обробники для експорту та імпорту
    ipcMain.handle('export-data', async () => {
      try {
        const [data, calendarData, settings] = await Promise.all([
          getData(),
          getCalendarData(),
          getSettings()
        ]);

        const exportData = {
          data,
          calendar: calendarData,
          settings
        };

        const { filePath } = await dialog.showSaveDialog({
          title: 'Експорт даних',
          defaultPath: path.join(app.getPath('documents'), 'onda-data.json'),
          filters: [{ name: 'JSON', extensions: ['json'] }]
        });

        if (filePath) {
          await fs.promises.writeFile(filePath, JSON.stringify(exportData, null, 2));
          return { success: true, filePath };
        }
        return { success: false, error: 'Експорт скасовано' };
      } catch (error) {
        console.error('Помилка при експорті даних:', error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('import-data', async (event, data) => {
      try {
        const { filePaths } = await dialog.showOpenDialog({
          title: 'Імпорт даних',
          properties: ['openFile'],
          filters: [{ name: 'JSON', extensions: ['json'] }]
        });

        if (filePaths && filePaths.length > 0) {
          const fileContent = await fs.promises.readFile(filePaths[0], 'utf8');
          const importedData = JSON.parse(fileContent);
          
          // Валідація імпортованих даних
          if (!importedData || typeof importedData !== 'object') {
            throw new Error('Невірний формат даних');
          }

          // Зберігаємо всі імпортовані дані
          await Promise.all([
            saveData(importedData.data || []),
            saveCalendarData(importedData.calendar || []),
            saveSettings(importedData.settings || {})
          ]);

          return { success: true };
        }
        return { success: false, error: 'Імпорт скасовано' };
      } catch (error) {
        console.error('Помилка при імпорті даних:', error);
        return { success: false, error: error.message };
      }
    });
  },
};