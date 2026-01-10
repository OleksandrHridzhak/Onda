/**
 * Database Export/Import Functions
 *
 * Functions for exporting and importing all data from/to RxDB.
 * Used by the sync service for server synchronization.
 */

import { getDatabase } from './index';

/**
 * Export all data from RxDB
 */
export async function exportData() {
  try {
    const db = await getDatabase();

    const columns = (await db.columns.find().exec()).map((doc) => doc.toJSON());
    const calendar = (await db.calendar.find().exec()).map((doc) =>
      doc.toJSON(),
    );
    const settings = (await db.settings.find().exec()).map((doc) =>
      doc.toJSON(),
    );
    const columnsOrder = (await db.columnsorder.find().exec()).map((doc) =>
      doc.toJSON(),
    );

    return {
      columns,
      calendar,
      settings,
      columnsOrder,
      exportDate: new Date().toISOString(),
      version: 3, // New version for RxDB format
    };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Import data into RxDB
 */
export async function importData(data: {
  columns?: any[];
  calendar?: any[];
  settings?: any[];
  columnsOrder?: any[];
  weeks?: any[]; // Legacy format
}) {
  try {
    const db = await getDatabase();

    // Import columns
    if (data.columns && data.columns.length > 0) {
      for (const col of data.columns) {
        await db.columns.upsert({
          ...col,
          updatedAt: col.updatedAt || Date.now(),
        });
      }
    }

    // Import calendar events
    if (data.calendar && data.calendar.length > 0) {
      // Handle both old format (single object with body array) and new format (array of events)
      const events =
        Array.isArray(data.calendar) && data.calendar[0]?.body
          ? data.calendar[0].body
          : data.calendar;

      for (const event of events) {
        if (event.id && event.title) {
          await db.calendar.upsert({
            id: event.id.toString(),
            title: event.title,
            date: event.date || new Date().toDateString(),
            startTime: event.startTime || '09:00',
            endTime: event.endTime || '10:00',
            color: event.color || '#2563eb',
            isRepeating: event.isRepeating ?? false,
            repeatDays: event.repeatDays || [],
            repeatFrequency: event.repeatFrequency || 'weekly',
            updatedAt: event.updatedAt || Date.now(),
          });
        }
      }
    }

    // Import settings
    if (data.settings && data.settings.length > 0) {
      for (const setting of data.settings) {
        // Skip columnsOrder which is stored in its own collection now
        if (setting.id === 'columnsOrder') {
          // Handle old columnsOrder format
          if (setting.columnIds) {
            await db.columnsorder.upsert({
              id: 'columnsOrder',
              columnIds: setting.columnIds,
              updatedAt: setting.lastUpdated
                ? new Date(setting.lastUpdated).getTime()
                : Date.now(),
            });
          }
          continue;
        }

        // Handle main settings
        if (setting.id === 1 || setting.id === 'appSettings') {
          await db.settings.upsert({
            id: 'appSettings',
            theme: setting.theme || {
              darkMode: false,
              accentColor: 'blue',
              autoThemeSettings: {
                enabled: false,
                startTime: '08:00',
                endTime: '20:00',
              },
            },
            table: setting.table || {
              showSummaryRow: false,
              compactMode: false,
              stickyHeader: true,
            },
            ui: setting.ui || {
              animations: true,
              tooltips: true,
              confirmDelete: true,
            },
            header: setting.header,
            calendar: setting.calendar,
            sync: setting.sync,
            updatedAt: setting.updatedAt || Date.now(),
          });
        }
      }
    }

    // Import columnsOrder (new format)
    if (data.columnsOrder && data.columnsOrder.length > 0) {
      for (const order of data.columnsOrder) {
        if (order.columnIds) {
          await db.columnsorder.upsert({
            id: order.id || 'columnsOrder',
            columnIds: order.columnIds,
            updatedAt: order.updatedAt || Date.now(),
          });
        }
      }
    }

    console.log('Data imported successfully');
    return { status: 'success', message: 'Data imported successfully' };
  } catch (error) {
    console.error('Import failed:', error);
    return { status: 'error', message: (error as Error).message };
  }
}

/**
 * Clear all data from database
 */
export async function clearAllData() {
  try {
    const db = await getDatabase();

    // Clear all collections
    const columns = await db.columns.find().exec();
    for (const doc of columns) {
      await doc.remove();
    }

    const calendar = await db.calendar.find().exec();
    for (const doc of calendar) {
      await doc.remove();
    }

    const settings = await db.settings.find().exec();
    for (const doc of settings) {
      await doc.remove();
    }

    const columnsOrder = await db.columnsorder.find().exec();
    for (const doc of columnsOrder) {
      await doc.remove();
    }

    console.log('All data cleared successfully');
    return { status: 'success', message: 'All data cleared' };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { status: 'error', message: (error as Error).message };
  }
}
