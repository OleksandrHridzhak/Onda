const { app, Notification, dialog } = require('electron');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../userData/data.json');
const CALENDAR_FILE = path.join(__dirname, '../userData/calendar.json');
const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');
const { getSettingsTemplates } = require('../constants/fileTemplates.js');
const { saveData, getData } = require('../utils/dataUtils.js');
const { updateThemeBasedOnTime } = require('../utils/utils.js');

const handleError = (err, message) => ({
  status: message,
  error: err.message,
});

module.exports = {
  init(ipcMain) {
    ipcMain.handle('switch-theme', async (event, darkMode) => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        settings.theme.darkMode = darkMode;
        await saveData(SETTINGS_FILE, settings, () => getSettingsTemplates());
        return { status: 'Theme switched', darkMode };
      } catch (err) {
        return handleError(err, 'Error parsing settings');
      }
    });

    ipcMain.handle('get-theme', async () => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        return { status: 'Theme fetched', darkMode: settings.theme.darkMode };
      } catch (err) {
        return handleError(err, 'Error parsing settings');
      }
    });

    ipcMain.handle('get-cell-settings', async () => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        return {
          status: 'Cell settings fetched',
          cellSettings: settings.theme.cellSettings || {},
        };
      } catch (err) {
        return handleError(err, 'Error parsing settings');
      }
    });
    ipcMain.handle('get-settings', async () => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        return { status: 'Settings fetched', data: settings };
      } catch (err) {
        return handleError(err, 'Error parsing settings');
      }
    });

    ipcMain.handle('update-settings', async (event, settings) => {
      try {
        await saveData(SETTINGS_FILE, settings, () => getSettingsTemplates());
        return { status: 'Settings updated' };
      } catch (err) {
        return handleError(err, 'Error updating settings');
      }
    });

    ipcMain.handle('update-theme', async (event, themeSettings) => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        settings.theme = { ...settings.theme, ...themeSettings };
        await saveData(SETTINGS_FILE, settings, () => getSettingsTemplates());
        updateThemeBasedOnTime();
        return { status: 'Theme updated' };
      } catch (err) {
        return handleError(err, 'Error updating theme');
      }
    });

    ipcMain.handle('update-table-settings', async (event, tableSettings) => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        settings.table = { ...settings.table, ...tableSettings };
        await saveData(SETTINGS_FILE, settings, () => getSettingsTemplates());
        return { status: 'Table settings updated' };
      } catch (err) {
        return handleError(err, 'Error updating table settings');
      }
    });

    ipcMain.handle('update-ui-settings', async (event, uiSettings) => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        settings.ui = { ...settings.ui, ...uiSettings };
        await saveData(SETTINGS_FILE, settings, () => getSettingsTemplates());
        return { status: 'UI settings updated' };
      } catch (err) {
        return handleError(err, 'Error updating UI settings');
      }
    });

    ipcMain.handle('update-column-order', async (event, columnOrder) => {
      try {
        const settings = await getData(SETTINGS_FILE, () =>
          getSettingsTemplates()
        );
        settings.table.columnOrder = columnOrder;
        await saveData(SETTINGS_FILE, settings, () => getSettingsTemplates());
        return { status: 'Column order updated' };
      } catch (err) {
        return handleError(err, 'Error updating column order');
      }
    });

    ipcMain.handle('show-notification', (event, { title, body }) => {
      new Notification({ title, body }).show();
    });

    ipcMain.handle('export-data', async () => {
      try {
        const [data, calendarData, settings] = await Promise.all([
          getData(DATA_FILE),
          getData(CALENDAR_FILE),
          getData(SETTINGS_FILE, () => getSettingsTemplates()),
        ]);

        const exportData = {
          data,
          calendar: calendarData,
          settings,
        };

        const { filePath } = await dialog.showSaveDialog({
          title: 'Data export',
          defaultPath: path.join(app.getPath('documents'), 'onda-data.json'),
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
        });

        if (!filePath) {
          return { status: 'Export cancelled' };
        }

        await saveData(filePath, exportData);
        return { status: 'Data exported', filePath };
      } catch (error) {
        console.error('Error exporting data:', error);
        return handleError(error, 'Export failed');
      }
    });

    ipcMain.handle('import-data', async () => {
      try {
        const { filePaths } = await dialog.showOpenDialog({
          title: 'Data import',
          defaultPath: app.getPath('documents'),
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
          properties: ['openFile'],
        });

        if (!filePaths || filePaths.length === 0) {
          return { status: 'Import cancelled' };
        }

        const importData = await getData(filePaths[0]);
        if (importData.data) {
          await saveData(DATA_FILE, importData.data);
        }
        if (importData.calendar) {
          await saveData(CALENDAR_FILE, importData.calendar);
        }
        if (importData.settings) {
          await saveData(SETTINGS_FILE, importData.settings, () =>
            getSettingsTemplates()
          );
        }

        return { status: 'Data imported' };
      } catch (error) {
        console.error('Error importing data:', error);
        return handleError(error, 'Import failed');
      }
    });
  },
};
