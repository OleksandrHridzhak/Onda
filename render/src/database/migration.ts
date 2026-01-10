import { openDB } from 'idb';
import { getDatabase } from './rxdb';
import { getSettingsTemplate } from '../utils/fileTemplates';

/**
 * Migration utility to transfer data from old IndexedDB to RxDB
 */
export class DataMigration {
  /**
   * Check if migration is needed
   */
  static async isMigrationNeeded(): Promise<boolean> {
    try {
      // Check if old IndexedDB exists
      const oldDbExists = await openDB('ondaDB', 2)
        .then(() => true)
        .catch(() => false);

      if (!oldDbExists) {
        return false;
      }

      // Check if RxDB already has data
      const db = await getDatabase();
      const settingsDoc = await db.settings.findOne({ selector: { _id: '1' } }).exec();

      // Migration needed if old DB exists and RxDB settings don't exist
      return !settingsDoc;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  }

  /**
   * Migrate all data from IndexedDB to RxDB
   */
  static async migrateData(): Promise<{
    status: 'success' | 'error';
    message: string;
  }> {
    try {
      console.log('🔄 Starting data migration from IndexedDB to RxDB...');

      // Open old IndexedDB
      const oldDb = await openDB('ondaDB', 2);

      // Get RxDB instance
      const db = await getDatabase();

      // Migrate columns
      const columnsData = await oldDb
        .transaction('columns', 'readonly')
        .objectStore('columns')
        .getAll();

      console.log(`📦 Migrating ${columnsData.length} columns...`);

      for (const col of columnsData) {
        await db.columns.upsert({
          _id: col.id,
          ...col,
        });
      }

      // Migrate settings
      const settingsData = await oldDb
        .transaction('settings', 'readonly')
        .objectStore('settings')
        .get(1);

      if (settingsData) {
        console.log('⚙️ Migrating settings...');
        await db.settings.upsert({
          _id: '1',
          ...settingsData,
        });
      } else {
        // Create default settings
        console.log('⚙️ Creating default settings...');
        await db.settings.upsert({
          _id: '1',
          ...getSettingsTemplate(),
        });
      }

      // Migrate calendar
      const calendarData = await oldDb
        .transaction('calendar', 'readonly')
        .objectStore('calendar')
        .get(1);

      if (calendarData) {
        console.log('📅 Migrating calendar...');
        await db.calendar.upsert({
          _id: '1',
          body: calendarData.body || [],
        });
      } else {
        // Create default calendar
        console.log('📅 Creating default calendar...');
        await db.calendar.upsert({
          _id: '1',
          body: [],
        });
      }

      // Note: weeks store was mentioned in indexedDB but not used in the codebase
      // Skipping weeks migration for now

      oldDb.close();

      console.log('✅ Migration completed successfully!');

      // Mark migration as completed
      localStorage.setItem('rxdb_migration_completed', 'true');

      return {
        status: 'success',
        message: 'Data migrated successfully',
      };
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        status: 'error',
        message: (error as Error).message,
      };
    }
  }

  /**
   * Initialize RxDB with default data if no migration needed
   */
  static async initializeDefaults(): Promise<void> {
    try {
      const db = await getDatabase();

      // Check if settings exist
      const settings = await db.settings.findOne({ selector: { _id: '1' } }).exec();
      if (!settings) {
        console.log('⚙️ Initializing default settings...');
        await db.settings.upsert({
          _id: '1',
          ...getSettingsTemplate(),
        });
      }

      // Check if calendar exists
      const calendar = await db.calendar.findOne({ selector: { _id: '1' } }).exec();
      if (!calendar) {
        console.log('📅 Initializing default calendar...');
        await db.calendar.upsert({
          _id: '1',
          body: [],
        });
      }

      // Note: columns will be created by user as needed
      // No default columns needed for initialization
    } catch (error) {
      console.error('Error initializing defaults:', error);
    }
  }

  /**
   * Run migration if needed, otherwise initialize defaults
   */
  static async runMigration(): Promise<void> {
    try {
      // Check if migration was already completed
      const migrationCompleted = localStorage.getItem(
        'rxdb_migration_completed',
      );

      if (migrationCompleted === 'true') {
        console.log('✅ Migration already completed');
        return;
      }

      const needsMigration = await this.isMigrationNeeded();

      if (needsMigration) {
        const result = await this.migrateData();
        if (result.status === 'success') {
          console.log('✅ Migration successful');
        } else {
          console.error('❌ Migration failed:', result.message);
        }
      } else {
        console.log('ℹ️ No migration needed, initializing defaults...');
        await this.initializeDefaults();
        localStorage.setItem('rxdb_migration_completed', 'true');
      }
    } catch (error) {
      console.error('❌ Migration process failed:', error);
    }
  }
}
