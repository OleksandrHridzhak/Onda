/**
 * Main IndexedDB file
 * @module services/indexedDB/index.js
 */

import { openDB } from 'idb';

/**
 * Called when initializing/opening the database
 *
 */
export const dbPromise = openDB('ondaDB', 2, {
    upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', {
                keyPath: 'id',
                autoIncrement: true,
            });
        }
        if (!db.objectStoreNames.contains('tableColumns')) {
            db.createObjectStore('tableColumns', {
                keyPath: 'id',
                autoIncrement: true,
            });
        }
        if (!db.objectStoreNames.contains('calendar')) {
            db.createObjectStore('calendar', {
                keyPath: 'id',
                autoIncrement: true,
            });
        }
    },
});

/**
 * Exports all data from IndexedDB
 * @returns {Object} Object with weeks, calendar, settings, columns
 */
export async function exportData() {
    try {
        const db = await dbPromise;
        const tx = db.transaction(
            ['calendar', 'settings', 'tableColumns'],
            'readonly',
        );
        const calendar = await tx.objectStore('calendar').getAll();
        const settings = await tx.objectStore('settings').getAll();
        const columns = await tx.objectStore('tableColumns').getAll();

        return {
            calendar,
            settings,
            columns,
            exportDate: new Date().toISOString(),
            version: 2, // version for future migrations
        };
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    }
}

/**
 * Imports data into IndexedDB
 * @param {Object} data - Object with weeks, calendar, settings, columns
 * @returns {Object} Operation result
 */
export async function importData(data) {
    try {
        const db = await dbPromise;
        const stores = ['calendar', 'settings', 'tableColumns'];
        const tx = db.transaction(stores, 'readwrite');

        // Import calendar
        if (data.calendar && data.calendar.length > 0) {
            const calendarStore = tx.objectStore('calendar');
            for (const cal of data.calendar) {
                await calendarStore.put(cal);
            }
        }

        // Import settings
        if (data.settings && data.settings.length > 0) {
            const settingsStore = tx.objectStore('settings');
            for (const s of data.settings) {
                await settingsStore.put(s);
            }
        }

        // Import columns
        if (data.columns && data.columns.length > 0) {
            const columnsStore = tx.objectStore('tableColumns');
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
