import Dexie, { type Table } from 'dexie';

interface ColumnMigrationRecord {
    lifecycle?: {
        createdAt: string | null;
        archivedAt: string | null;
    };
}

export class OndaDB extends Dexie {
    constructor() {
        super('ondaDexieDB');

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
                    .table<ColumnMigrationRecord>('tableColumns')
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
    }
}

export const db = new OndaDB();

export function getTable<T>(name: string): Table<T, string> {
    return db.table<T, string>(name);
}

export function runTransaction<T>(
    tableNames: string[],
    scope: () => Promise<T>,
): Promise<T> {
    const tables = tableNames.map((name) => db.table<unknown, string>(name));
    const transaction = db.transaction.bind(db) as unknown as (
        mode: 'rw',
        transactionTables: Table<unknown, string>[],
        transactionScope: () => Promise<T>,
    ) => Promise<T>;

    return transaction('rw', tables, scope);
}

export type { DbResult } from './types';
