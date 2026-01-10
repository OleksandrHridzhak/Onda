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
let dbInstance: OndaDatabase | null = null;

/**
 * Initialize RxDB database
 * Creates database instance with all collections
 */
export async function initDatabase(): Promise<OndaDatabase> {
  // Return cached instance if available
  if (dbInstance) {
    return dbInstance;
  }

  // Return pending promise if initialization is in progress
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = (async () => {
    try {
      console.log('🗄️ Initializing RxDB database...');

      // Dynamic imports to work around TypeScript module resolution issues with RxDB v16
      const rxdb: any = await import('rxdb');
      const storageDexie: any = await import('rxdb/plugins/storage-dexie');
      const validateAjv: any = await import('rxdb/plugins/validate-ajv');

      const { createRxDatabase, removeRxDatabase } = rxdb;
      const { getRxStorageDexie } = storageDexie;
      const { wrappedValidateAjvStorage } = validateAjv;

      const storage = wrappedValidateAjvStorage({
        storage: getRxStorageDexie(),
      });

      let db;
      try {
        // Try to create database
        db = await createRxDatabase({
          name: 'ondadb',
          storage,
          multiInstance: true,
          eventReduce: true,
          ignoreDuplicate: false, // Set to false to catch duplicates
        });
      } catch (error: any) {
        // If database already exists (DB9), try to remove and recreate
        if (error?.code === 'DB9' || error?.parameters?.database === 'ondadb') {
          console.log('🔄 Database already exists, removing and recreating...');
          try {
            await removeRxDatabase('ondadb', storage);
          } catch (removeError) {
            console.warn('Could not remove old database:', removeError);
          }
          
          // Retry creating database
          db = await createRxDatabase({
            name: 'ondadb',
            storage,
            multiInstance: true,
            eventReduce: true,
            ignoreDuplicate: false,
          });
        } else {
          throw error;
        }
      }

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

      // Cache the instance
      dbInstance = db;
      return db;
    } catch (error) {
      // Reset promise on error so it can be retried
      dbPromise = null;
      console.error('Failed to initialize RxDB:', error);
      throw error;
    }
  })();

  return dbPromise;
}

/**
 * Get database instance
 * Returns cached promise if already initialized
 */
export function getDatabase(): Promise<OndaDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }
  return initDatabase();
}

/**
 * Destroy database instance
 * Useful for testing or cleanup
 */
export async function destroyDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.destroy();
    dbInstance = null;
    dbPromise = null;
  } else if (dbPromise) {
    try {
      const db = await dbPromise;
      await db.destroy();
    } catch (error) {
      console.error('Error destroying database:', error);
    }
    dbInstance = null;
    dbPromise = null;
  }
}
