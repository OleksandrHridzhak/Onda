export interface SettingsDocument {
  _id: string; // Always '1' for singleton settings
  theme: {
    darkMode: boolean;
    colorScheme: string;
    themeMode: string;
  };
  table: {
    columnOrder: string[];
    [key: string]: any;
  };
  ui: {
    [key: string]: any;
  };
  sync?: {
    enabled: boolean;
    serverUrl?: string;
    secretKey?: string;
    autoSync: boolean;
    syncInterval?: number;
    version?: number;
    lastSync?: string | null;
  };
  pomodoro?: {
    [key: string]: any;
  };
}

export const settingsSchema: any = {
  version: 0,
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 10,
    },
    theme: {
      type: 'object',
      properties: {
        darkMode: { type: 'boolean' },
        colorScheme: { type: 'string' },
        themeMode: { type: 'string' },
      },
    },
    table: {
      type: 'object',
    },
    ui: {
      type: 'object',
    },
    sync: {
      type: 'object',
    },
    pomodoro: {
      type: 'object',
    },
  },
  required: ['_id'],
};
