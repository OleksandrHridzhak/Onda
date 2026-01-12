/**
 * Main Indexeddb file
 */

import { openDB } from 'idb';
import { getColumnTemplates } from '../../utils/fileTemplates';

/**
 * We call the function when w
 *
 */
export const dbPromise = openDB('ondaDB', 2, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('weeks')) {
      db.createObjectStore('weeks', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('calendar')) {
      db.createObjectStore('calendar', { keyPath: 'id', autoIncrement: true });
    }

    // Нова версія: створюємо окреме сховище для колонок
    if (oldVersion < 2) {
      if (!db.objectStoreNames.contains('columns')) {
        db.createObjectStore('columns', { keyPath: 'id' });
      }
    }
  },
});

/**
 * Експортує всі дані з IndexedDB
 * @returns {Object} Об'єкт з weeks, calendar, settings, columns
 */
export async function exportData() {
  try {
    const db = await dbPromise;
    const tx = db.transaction(
      ['weeks', 'calendar', 'settings', 'columns'],
      'readonly',
    );

    const weeks = await tx.objectStore('weeks').getAll();
    const calendar = await tx.objectStore('calendar').getAll();
    const settings = await tx.objectStore('settings').getAll();
    const columns = await tx.objectStore('columns').getAll();

    return {
      weeks,
      calendar,
      settings,
      columns,
      exportDate: new Date().toISOString(),
      version: 2, // версія для майбутніх міграцій
    };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Імпортує дані в IndexedDB
 * @param {Object} data - Об'єкт з weeks, calendar, settings, columns
 * @returns {Object} Результат операції
 */
export async function importData(data) {
  try {
    const db = await dbPromise;
    const stores = ['weeks', 'calendar', 'settings', 'columns'];
    const tx = db.transaction(stores, 'readwrite');

    // Імпорт weeks
    if (data.weeks && data.weeks.length > 0) {
      const weeksStore = tx.objectStore('weeks');
      for (const week of data.weeks) {
        await weeksStore.put(week);
      }
    }

    // Імпорт calendar
    if (data.calendar && data.calendar.length > 0) {
      const calendarStore = tx.objectStore('calendar');
      for (const cal of data.calendar) {
        await calendarStore.put(cal);
      }
    }

    // Імпорт settings
    if (data.settings && data.settings.length > 0) {
      const settingsStore = tx.objectStore('settings');
      for (const s of data.settings) {
        await settingsStore.put(s);
      }
    }

    // Імпорт columns
    if (data.columns && data.columns.length > 0) {
      const columnsStore = tx.objectStore('columns');
      for (const col of data.columns) {
        await columnsStore.put(col);
      }
    }

    await tx.done;
    return { status: 'success', message: 'Data imported successfully' };
  } catch (error) {
    console.error('Import failed:', error);
    return { status: 'error', message: error.message };
  }
}
