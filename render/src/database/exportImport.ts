import { getDatabase } from '../../database/rxdb';

/**
 * Export all data from RxDB
 * Used for sync operations
 */
export async function exportData() {
  try {
    const db = await getDatabase();

    // Get all data from collections
    const columnsDocs = await db.columns.find().exec();
    const columns = columnsDocs.map((doc: any) => doc.toJSON());

    const settingsDoc = await db.settings.findOne({ selector: { _id: '1' } }).exec();
    const settings = settingsDoc ? [settingsDoc.toJSON()] : [];

    const calendarDoc = await db.calendar.findOne({ selector: { _id: '1' } }).exec();
    const calendar = calendarDoc ? [calendarDoc.toJSON()] : [];

    return {
      columns,
      calendar,
      settings,
      weeks: [], // weeks not used in current implementation
      exportDate: new Date().toISOString(),
      version: 2,
    };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Import data into RxDB
 * Used for sync operations
 */
export async function importData(data: any) {
  try {
    const db = await getDatabase();

    // Import columns
    if (data.columns && data.columns.length > 0) {
      for (const col of data.columns) {
        await db.columns.upsert({
          _id: col.id || col._id,
          ...col,
        });
      }
    }

    // Import calendar
    if (data.calendar && data.calendar.length > 0) {
      const calendarData = data.calendar[0];
      await db.calendar.upsert({
        _id: '1',
        body: calendarData.body || [],
      });
    }

    // Import settings
    if (data.settings && data.settings.length > 0) {
      const settingsData = data.settings[0];
      await db.settings.upsert({
        _id: '1',
        ...settingsData,
      });
    }

    return { status: 'success', message: 'Data imported successfully' };
  } catch (error) {
    console.error('Import failed:', error);
    return { status: 'error', message: (error as Error).message };
  }
}

/**
 * Clear all data from RxDB
 * Used for data reset functionality
 */
export async function clearAllData() {
  try {
    const db = await getDatabase();

    // Clear all columns
    const columnDocs = await db.columns.find().exec();
    for (const doc of columnDocs) {
      await doc.remove();
    }

    // Clear calendar
    const calendarDoc = await db.calendar.findOne({ selector: { _id: '1' } }).exec();
    if (calendarDoc) {
      await calendarDoc.update({
        $set: {
          body: [],
        },
      });
    }

    // Clear settings (reset to defaults would require importing from fileTemplates)
    // For now, just clear sync settings
    const settingsDoc = await db.settings.findOne({ selector: { _id: '1' } }).exec();
    if (settingsDoc) {
      await settingsDoc.update({
        $set: {
          sync: undefined,
        },
      });
    }

    console.log('All data successfully cleared');
    return { status: 'success', message: 'All data cleared' };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { status: 'error', message: (error as Error).message };
  }
}
