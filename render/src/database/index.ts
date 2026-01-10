/**
 * RxDB Database Configuration
 *
 * This module initializes and exports the RxDB database instance.
 * Uses IndexedDB storage for persistence in the browser.
 */

import {
  columnSchema,
  ColumnDocument,
  ColumnCollection,
  Column,
} from './schemas/column.schema';
import {
  calendarEventSchema,
  CalendarEventDocument,
  CalendarEventCollection,
  CalendarEvent,
} from './schemas/calendarEvent.schema';
import {
  settingsSchema,
  SettingsDocument,
  SettingsCollection,
  Settings,
} from './schemas/settings.schema';
import {
  columnsOrderSchema,
  ColumnsOrderDocument,
  ColumnsOrderCollection,
  ColumnsOrder,
} from './schemas/columnsOrder.schema';

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
const RxDB = require('rxdb') as any;
const RxDBStorageDexie = require('rxdb/plugins/storage-dexie') as any;
/* eslint-enable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */

const { createRxDatabase } = RxDB;
const { getRxStorageDexie } = RxDBStorageDexie;

// Define the database collections type
export type OndaCollections = {
  columns: ColumnCollection;
  calendar: CalendarEventCollection;
  settings: SettingsCollection;
  columnsorder: ColumnsOrderCollection;
};

// Define OndaDatabase as any since we're using dynamic imports
export type OndaDatabase = any;

let dbPromise: Promise<OndaDatabase> | null = null;

/**
 * Initialize and get the RxDB database instance.
 * Creates a singleton database that can be reused across the app.
 */
export async function getDatabase(): Promise<OndaDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = createRxDatabase({
    name: 'ondadb',
    storage: getRxStorageDexie(),
  }).then(async (db: any) => {
    // Create collections
    await db.addCollections({
      columns: {
        schema: columnSchema,
      },
      calendar: {
        schema: calendarEventSchema,
      },
      settings: {
        schema: settingsSchema,
      },
      columnsorder: {
        schema: columnsOrderSchema,
      },
    });

    console.log('RxDB database initialized');
    return db;
  });

  return dbPromise;
}

// Re-export hooks
export { useColumns, useColumn } from './hooks/useColumns';
export { useCalendarEvents } from './hooks/useCalendar';
export { useSettings } from './hooks/useSettings';

// Re-export types
export type {
  Column,
  ColumnDocument,
  ColumnCollection,
  CalendarEvent,
  CalendarEventDocument,
  CalendarEventCollection,
  Settings,
  SettingsDocument,
  SettingsCollection,
  ColumnsOrder,
  ColumnsOrderDocument,
  ColumnsOrderCollection,
};

// Re-export data operations
export { exportData, importData, clearAllData } from './dataOperations';

// Re-export provider
export { DatabaseProvider, useDatabase } from './DatabaseProvider';
