const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

const DATA_FILE = path.join(__dirname, 'data.json');

// Функція для перевірки та створення файлу, якщо його немає
const ensureDataFileExists = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

module.exports = {
  init(ipcMain,mainWindow) {
    ipcMain.handle('get-data', () => {
      ensureDataFileExists(); // Перевіряємо та створюємо файл
      return JSON.parse(fs.readFileSync(DATA_FILE));
    });
    ipcMain.handle('get-time', () => {
      const now = new Date();
      return { time: now.toISOString() }; // Повертаємо час у форматі ISO
    });
    
    ipcMain.handle('save-data', (event, data) => {
      ensureDataFileExists(); // Перевіряємо та створюємо файл
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return { status: 'Data saved!' };
    });

    ipcMain.handle('get-all-days', () => {
      ensureDataFileExists(); // Перевіряємо та створюємо файл
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      try {
        const data = JSON.parse(fileContent);
        return { status: 'Data fetched', data };
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }
    });

    ipcMain.handle('column-change', (event, updatedCheckbox) => {
      ensureDataFileExists(); // Перевіряємо та створюємо файл
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }

      const index = data.findIndex(
        (item) => item.ColumnId === updatedCheckbox.ColumnId
      );

      if (index === -1) {
        return { status: 'Checkbox not found' };
      }

      data[index] = updatedCheckbox;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return { status: 'Checkbox updated', data: updatedCheckbox };
    });

    ipcMain.handle('create-component', (event, type) => {
      const templates = {
        checkbox: {
          ColumnId: Date.now().toString(),
          Type: 'checkbox',
          Name: 'New Checkbox',
          Description: 'Checkbox created on backend',
          EmojiIcon: '✅',
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
          EmojiIcon: '🔢',
          NameVisible: false,
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
          EmojiIcon: '✏️',
          NameVisible: false,
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
          EmojiIcon: '📝',
          NameVisible: true,
          Options: ['Option 1', 'Option 2'],
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

      ensureDataFileExists(); // Перевіряємо та створюємо файл
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

    ipcMain.handle('delete-component', (event, columnId) => {
      ensureDataFileExists(); // Перевіряємо та створюємо файл
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
    ipcMain.handle('window-close', () => {
      app.quit();
    });
    ipcMain.handle('window-minimize', () => {
      mainWindow.minimize();
    });
  
    ipcMain.handle('window-maximize', () => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    });
  },
};