/**
 * Settings Schema for RxDB
 *
 * Stores application settings including theme, table, UI, and sync configurations.
 */

// Settings type definition
export interface Settings {
  id: string;
  theme: {
    darkMode: boolean;
    accentColor: string;
    autoThemeSettings: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  table: {
    showSummaryRow: boolean;
    compactMode: boolean;
    stickyHeader: boolean;
  };
  ui: {
    animations: boolean;
    tooltips: boolean;
    confirmDelete: boolean;
  };
  header?: {
    layout: string;
  };
  calendar?: {
    notifications: boolean;
  };
  sync?: {
    enabled: boolean;
    serverUrl: string;
    secretKey: string;
    autoSync: boolean;
    syncInterval: number;
    lastSync: string | null;
    version: number;
  };
  updatedAt: number;
}

export type SettingsDocument = Settings & { toJSON: () => Settings };
export type SettingsCollection = any;

export const settingsSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    theme: {
      type: 'object',
      properties: {
        darkMode: { type: 'boolean' },
        accentColor: { type: 'string' },
        autoThemeSettings: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            startTime: { type: 'string' },
            endTime: { type: 'string' },
          },
        },
      },
    },
    table: {
      type: 'object',
      properties: {
        showSummaryRow: { type: 'boolean' },
        compactMode: { type: 'boolean' },
        stickyHeader: { type: 'boolean' },
      },
    },
    ui: {
      type: 'object',
      properties: {
        animations: { type: 'boolean' },
        tooltips: { type: 'boolean' },
        confirmDelete: { type: 'boolean' },
      },
    },
    header: {
      type: 'object',
      properties: {
        layout: { type: 'string' },
      },
    },
    calendar: {
      type: 'object',
      properties: {
        notifications: { type: 'boolean' },
      },
    },
    sync: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        serverUrl: { type: 'string' },
        secretKey: { type: 'string' },
        autoSync: { type: 'boolean' },
        syncInterval: { type: 'number' },
        lastSync: { type: ['string', 'null'] },
        version: { type: 'number' },
      },
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: ['id', 'theme', 'table', 'ui', 'updatedAt'],
} as const;
