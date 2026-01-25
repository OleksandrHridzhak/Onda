import { clearAllColumnsIDB } from './columnsDB';
import { dbPromise } from '.';

/**
 * Clear all data (weeks, settings, calendar)
 * from database for "Clear Data" button in Settings.
 *
 */
export async function clearAllData() {
    try {
        // Clear columns and their order
        await clearAllColumnsIDB();

        // Clear other stores if needed
        const db = await dbPromise;
        const tx = db.transaction(
            ['weeks', 'settings', 'calendar'],
            'readwrite',
        );

        // Clear weeks (old structure)
        await tx.objectStore('weeks').clear();

        // Clear calendar events
        await tx.objectStore('calendar').clear();

        // Clear all settings except columnsOrder (already cleared in clearAllColumns)
        const settingsStore = tx.objectStore('settings');
        const allSettings = await settingsStore.getAllKeys();
        for (const key of allSettings) {
            if (key !== 'columnsOrder') {
                await settingsStore.delete(key);
            }
        }

        await tx.done;

        console.log('All data successfully cleared');
        return { status: 'success', message: 'All data cleared' };
    } catch (error) {
        console.error('Error clearing data:', error);
        return { status: 'error', message: error.message };
    }
}
