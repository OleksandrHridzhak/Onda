import Dexie, { type Table } from 'dexie';
import { CalendarEntry } from '../types/calendar.types';
import { Setting } from '../types/settings.types';
import { Column } from '../types/newColumn.types';

/**  Main database class
 *
 * Used classes for better types support
 *
 */

export class OndaDB extends Dexie {
    settings!: Table<Setting, string>;
    tableColumns!: Table<Column, string>;
    calendar!: Table<CalendarEntry, string>;

    constructor() {
        super('ondaDexieDB');
        /**
         * Define tables and their primary key(id) and indexes(date)
         */
        this.version(2).stores({
            settings: 'id',
            tableColumns: 'id',
            calendar: 'id, date',
        });
        /**
         * Populate DB(only when calls constructor) with default settings on first creation to avoid
         * problems with settings and it`s id "global"
         */
        this.on('populate', () => {
            this.settings.add({
                id: 'global',
                columnsOrder: [],
                darkMode: false,
                sync: {
                    syncServerUrl: 'https://onda-39t4.onrender.com',
                    syncSecretKey: '',
                    isSyncEnabled: false,
                },
            });
            console.log('Database populated with default settings');
        });
    }
}

export const db = new OndaDB();
