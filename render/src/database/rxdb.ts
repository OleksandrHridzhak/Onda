import { createRxDatabase, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import { columnSchema, ColumnDocument } from './schemas/column.schema';
import { settingsSchema, SettingsDocument } from './schemas/settings.schema';
import { calendarSchema, CalendarDocument } from './schemas/calendar.schema';

// Define database collections type
export interface OndaCollections {
  columns: any; // RxCollection<ColumnDocument>
  settings: any; // RxCollection<SettingsDocument>
  calendar: any; // RxCollection<CalendarDocument>
}

export type OndaDatabase = RxDatabase<OndaCollections>;

let dbPromise: Promise<OndaDatabase> | null = null;

/**
 * Initialize RxDB database
 * Creates database instance with all collections
 */
export async function initDatabase(): Promise<OndaDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = (async () => {
    console.log('🗄️ Initializing RxDB database...');

    // Create database
    const db = await createRxDatabase<OndaCollections>({
      name: 'ondadb',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageDexie(),
      }),
      multiInstance: true,
      eventReduce: true,
      ignoreDuplicate: true,
    });

    console.log('📦 Creating collections...');

    // Add collections
    await db.addCollections({
      columns: {
        schema: columnSchema,
      },
      settings: {
        schema: settingsSchema,
      },
      calendar: {
        schema: calendarSchema,
      },
    });

    console.log('✅ RxDB database initialized successfully');

    return db;
  })();

  return dbPromise;
}

/**
 * Get database instance
 * Returns cached promise if already initialized
 */
export function getDatabase(): Promise<OndaDatabase> {
  if (!dbPromise) {
    return initDatabase();
  }
  return dbPromise;
}

/**
 * Destroy database instance
 * Useful for testing or cleanup
 */
export async function destroyDatabase(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    await db.destroy();
    dbPromise = null;
  }
}
