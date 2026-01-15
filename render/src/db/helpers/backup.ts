import { ExportData } from '../types';
import { db } from '../index';

/**
 * Exports all data from the database
 */
export async function exportData(): Promise<ExportData> {
    try {
        const [calendar, settings, columns] = await Promise.all([
            db.calendar.toArray(),
            db.settings.toArray(),
            db.tableColumns.toArray(),
        ]);

        return {
            calendar,
            settings,
            columns: columns,
            exportDate: new Date().toISOString(),
            version: 2,
        };
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    }
}

/**
 * Imports data with full type safety
 */
export async function importData(
    data: Partial<ExportData>,
): Promise<{ status: string; message: string }> {
    try {
        await db.transaction(
            'rw',
            [db.calendar, db.settings, db.tableColumns],
            async () => {
                await Promise.all([
                    db.calendar.clear(),
                    db.settings.clear(),
                    db.tableColumns.clear(),
                ]);
                if (data.calendar?.length)
                    await db.calendar.bulkPut(data.calendar);
                if (data.settings?.length)
                    await db.settings.bulkPut(data.settings);
                if (data.columns?.length)
                    await db.tableColumns.bulkPut(data.columns);
            },
        );

        return { status: 'success', message: 'Data imported successfully' };
    } catch (error) {
        console.error('Import failed:', error);
        return { status: 'error', message: (error as Error).message };
    }
}
