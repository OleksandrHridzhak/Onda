import type { Column } from 'entities/Column';
import type { ColumnEntry } from 'entities/ColumnEntry';
import type { CalendarEntry } from 'entities/CalendarEvent';
import { DEFAULT_SETTINGS, type Setting } from 'entities/Settings';
import { getTable, runTransaction, type DbResult } from 'shared/api/db';

const columnsTable = getTable<Column>('tableColumns');
const calendarTable = getTable<CalendarEntry>('calendar');
const settingsTable = getTable<Setting>('settings');
const entriesTable = getTable<ColumnEntry>('columnEntries');

export async function clearAllData(): Promise<
    DbResult<{
        deletedColumns: number;
        deletedEvents: number;
        resetSettings: boolean;
    }>
> {
    try {
        return await runTransaction(
            ['tableColumns', 'calendar', 'settings', 'columnEntries'],
            async () => {
                const deletedColumns = await columnsTable.count();
                const deletedEvents = await calendarTable.count();

                await columnsTable.clear();
                await calendarTable.clear();
                await entriesTable.clear();
                await settingsTable.clear();
                await settingsTable.add(DEFAULT_SETTINGS);

                return {
                    success: true,
                    data: {
                        deletedColumns,
                        deletedEvents,
                        resetSettings: true,
                    },
                };
            },
        );
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
