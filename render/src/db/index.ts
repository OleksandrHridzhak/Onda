import Dexie, { type Table } from 'dexie';
import { CalendarEntry } from '../types/calendar.types';
import { Setting } from '../types/settings.types';
import { Column } from '../types/newColumn.types';
import { DEFAULT_SETTINGS } from './constants';

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
            this.settings.add(DEFAULT_SETTINGS);
            console.log('Database populated with default settings');
        });
    }
}

export const db = new OndaDB();
