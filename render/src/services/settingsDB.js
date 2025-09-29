import { dbPromise } from './indexedDB.js';
import { getSettingsTemplates } from '../constants/fileTemplates.js';
import { updateThemeBasedOnTime } from '../utils/utils.js';

const handleError = (err, message) => ({
  status: message,
  error: err.message,
});

export const settingsService = {
  async initSettings() {
    const db = await dbPromise;
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');

    const existing = await store.get(1);
    if (!existing) {
      await store.put({ id: 1, ...getSettingsTemplates() });
    }

    await tx.done;
  },

  async getSettings() {
    try {
      const db = await dbPromise;
      const store = db.transaction('settings', 'readonly').objectStore('settings');
      const settings = await store.get(1);

      if (!settings) return { status: 'Settings not found', data: getSettingsTemplates() };
      return { status: 'Settings fetched', data: settings };
    } catch (err) {
      return handleError(err, 'Error fetching settings');
    }
  },

  async updateSettings(newSettings) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');

      const settings = await store.get(1) || getSettingsTemplates();
      const updated = { ...settings, ...newSettings };

      await store.put({ id: 1, ...updated });
      await tx.done;

      return { status: 'Settings updated' };
    } catch (err) {
      return handleError(err, 'Error updating settings');
    }
  },

  async switchTheme(darkMode) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');

      const settings = await store.get(1) || getSettingsTemplates();
      settings.theme = { ...settings.theme, darkMode };

      await store.put({ id: 1, ...settings });
      await tx.done;

      return { status: 'Theme switched', darkMode };
    } catch (err) {
      return handleError(err, 'Error switching theme');
    }
  },

  async updateTheme(themeSettings) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');

      const settings = await store.get(1) || getSettingsTemplates();
      settings.theme = { ...settings.theme, ...themeSettings };

      await store.put({ id: 1, ...settings });
      await tx.done;

      updateThemeBasedOnTime();
      return { status: 'Theme updated' };
    } catch (err) {
      return handleError(err, 'Error updating theme');
    }
  },

  async updateTableSettings(tableSettings) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');

      const settings = await store.get(1) || getSettingsTemplates();
      settings.table = { ...settings.table, ...tableSettings };

      await store.put({ id: 1, ...settings });
      await tx.done;

      return { status: 'Table settings updated' };
    } catch (err) {
      return handleError(err, 'Error updating table settings');
    }
  },

  async updateUISettings(uiSettings) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');

      const settings = await store.get(1) || getSettingsTemplates();
      settings.ui = { ...settings.ui, ...uiSettings };

      await store.put({ id: 1, ...settings });
      await tx.done;

      return { status: 'UI settings updated' };
    } catch (err) {
      return handleError(err, 'Error updating UI settings');
    }
  },

  async updateColumnOrder(columnOrder) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');

      const settings = await store.get(1) || getSettingsTemplates();
      settings.table.columnOrder = columnOrder;

      await store.put({ id: 1, ...settings });
      await tx.done;

      return { status: 'Column order updated' };
    } catch (err) {
      return handleError(err, 'Error updating column order');
    }
  },
};
