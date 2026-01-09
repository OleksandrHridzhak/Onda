import { getDatabase } from '../database/rxdb';
import { SettingsDocument } from '../database/schemas/settings.schema';

/**
 * Service for managing settings in RxDB
 * Provides backward-compatible API with the old settingsDB.js
 */

const handleError = (err: any, message: string) => ({
  status: message,
  error: err.message,
});

export const settingsService = {
  async initSettings() {
    try {
      const db = await getDatabase();
      // Settings are initialized by migration, so this is a no-op
      return { status: 'Settings initialized' };
    } catch (err) {
      return handleError(err, 'Error initializing settings');
    }
  },

  async getSettings(): Promise<
    | { status: 'Settings fetched'; data: any }
    | { status: string; error: any; data?: never }
  > {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return { status: 'Settings not found', error: 'Settings not found' };
      }

      return { status: 'Settings fetched', data: doc.toJSON() };
    } catch (err) {
      return handleError(err, 'Error fetching settings');
    }
  },

  async updateSettings(newSettings: Partial<SettingsDocument>) {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return handleError(
          new Error('Settings not found'),
          'Settings not found',
        );
      }

      await doc.update({
        $set: newSettings,
      });

      return { status: 'Settings updated' };
    } catch (err) {
      return handleError(err, 'Error updating settings');
    }
  },

  async switchTheme(darkMode: boolean) {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return handleError(
          new Error('Settings not found'),
          'Settings not found',
        );
      }

      await doc.update({
        $set: {
          'theme.darkMode': darkMode,
        },
      });

      return { status: 'Theme switched', darkMode };
    } catch (err) {
      return handleError(err, 'Error switching theme');
    }
  },

  async getTheme() {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return { status: 'Theme fetched', darkMode: false };
      }

      const data = doc.toJSON();
      return {
        status: 'Theme fetched',
        darkMode: data.theme?.darkMode || false,
      };
    } catch (err) {
      return handleError(err, 'Error fetching theme');
    }
  },

  async updateTheme(themeSettings: any) {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return handleError(
          new Error('Settings not found'),
          'Settings not found',
        );
      }

      const currentTheme = doc.toJSON().theme || {};
      await doc.update({
        $set: {
          theme: { ...currentTheme, ...themeSettings },
        },
      });

      return { status: 'Theme updated' };
    } catch (err) {
      return handleError(err, 'Error updating theme');
    }
  },

  async updateSettingsSection(newObject: any, section: string) {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return handleError(
          new Error('Settings not found'),
          'Settings not found',
        );
      }

      const currentSection = (doc.toJSON() as any)[section] || {};
      await doc.update({
        $set: {
          [section]: { ...currentSection, ...newObject },
        },
      });

      return { status: 'Settings section updated' };
    } catch (err) {
      return handleError(err, 'Error updating settings section');
    }
  },

  async updateTableSettings(tableSettings: any) {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return handleError(
          new Error('Settings not found'),
          'Settings not found',
        );
      }

      const currentTable = doc.toJSON().table || {};
      await doc.update({
        $set: {
          table: { ...currentTable, ...tableSettings },
        },
      });

      return { status: 'Table settings updated' };
    } catch (err) {
      return handleError(err, 'Error updating table settings');
    }
  },

  async updateUISettings(uiSettings: any) {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return handleError(
          new Error('Settings not found'),
          'Settings not found',
        );
      }

      const currentUI = doc.toJSON().ui || {};
      await doc.update({
        $set: {
          ui: { ...currentUI, ...uiSettings },
        },
      });

      return { status: 'UI settings updated' };
    } catch (err) {
      return handleError(err, 'Error updating UI settings');
    }
  },

  async updateColumnOrder(columnOrder: string[]) {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('1').exec();

      if (!doc) {
        return handleError(
          new Error('Settings not found'),
          'Settings not found',
        );
      }

      await doc.update({
        $set: {
          'table.columnOrder': columnOrder,
        },
      });

      return { status: 'Column order updated' };
    } catch (err) {
      return handleError(err, 'Error updating column order');
    }
  },
};
