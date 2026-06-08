import Dexie, { type Table } from 'dexie';
import { CalendarEntry } from 'shared/types/calendar.types';
import { Setting } from 'shared/types/settings.types';
import { Column } from 'shared/types/newColumn.types';
import { ColumnEntry } from 'shared/types/columnEntries.types';
import { DEFAULT_SETTINGS } from 'db/constants';

/**  Main database class
 *
 * Used classes for better types support
 *
 */

export class OndaDB extends Dexie {
    settings!: Table<Setting, string>;
    tableColumns!: Table<Column, string>;
    calendar!: Table<CalendarEntry, string>;
    columnEntries!: Table<ColumnEntry, string>;

    constructor() {
        super('ondaDexieDB');
        /**
         * Define tables and their primary key(id) and indexes(date)
         */
        this.version(3).stores({
            settings: 'id',
            tableColumns: 'id',
            calendar: 'id, date',
            columnEntries:
                'id, columnId, dateKey, dayDate, weekStart, scope, [columnId+dateKey]',
        });

        this.version(4)
            .stores({
                settings: 'id',
                tableColumns: 'id',
                calendar: 'id, date',
                columnEntries:
                    'id, columnId, dateKey, dayDate, weekStart, scope, [columnId+dateKey]',
            })
            .upgrade(async (transaction) => {
                await transaction
                    .table<Column>('tableColumns')
                    .toCollection()
                    .modify((column) => {
                        if (!column.lifecycle) {
                            column.lifecycle = {
                                createdAt: null,
                                archivedAt: null,
                            };
                        }
                    });
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
