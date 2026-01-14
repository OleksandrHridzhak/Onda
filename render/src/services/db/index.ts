import Dexie, { type Table } from 'dexie';
import { CalendarEntry } from '../../types/calendar.types';
import { Setting } from '../../types/settings.types';
import { Column } from '../../types/newColumn.types';

/**
 * Interface for the export format
 */
export interface ExportData {
    calendar: CalendarEntry[];
    settings: Setting[];
    columns: Column[];
    exportDate: string;
    version: number;
}

/**  Database class
 *
 * Used OOP for better types support
 *
 */

export class OndaDB extends Dexie {
    // Declare implicit table properties.
    // (Table is generic: Table<T, TKey>)
    settings!: Table<Setting, number>;
    tableColumns!: Table<Column, number>;
    calendar!: Table<CalendarEntry, number>;

    constructor() {
        super('ondaDB');

        this.version(2).stores({
            settings: 'id',
            tableColumns: '++id',
            calendar: '++id',
        });
    }
}

export const db = new OndaDB();

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
