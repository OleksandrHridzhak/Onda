import { columnSchema, ColumnDocument } from './schemas/column.schema';
import { settingsSchema, SettingsDocument } from './schemas/settings.schema';
import { calendarSchema, CalendarDocument } from './schemas/calendar.schema';

// Define database collections type
export interface OndaCollections {
  columns: any; // RxCollection<ColumnDocument>
  settings: any; // RxCollection<SettingsDocument>
  calendar: any; // RxCollection<CalendarDocument>
}

export type OndaDatabase = any; // RxDatabase<OndaCollections> - using any to avoid type issues

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

    // Dynamic imports to work around TypeScript module resolution issues with RxDB v16
    const rxdb: any = await import('rxdb');
    const storageDexie: any = await import('rxdb/plugins/storage-dexie');
    const validateAjv: any = await import('rxdb/plugins/validate-ajv');

    const { createRxDatabase } = rxdb;
    const { getRxStorageDexie } = storageDexie;
    const { wrappedValidateAjvStorage } = validateAjv;

    // Create database
    const db = await createRxDatabase({
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
