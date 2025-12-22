interface AutoThemeSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface ThemeSettings {
  darkMode: boolean;
  accentColor: string;
  autoThemeSettings: AutoThemeSettings;
}

interface TableSettings {
  columnOrder: unknown[];
  showSummaryRow: boolean;
  compactMode: boolean;
  stickyHeader: boolean;
}

interface UiSettings {
  animations: boolean;
  tooltips: boolean;
  confirmDelete: boolean;
}

interface SettingsTemplate {
  theme: ThemeSettings;
  table: TableSettings;
  ui: UiSettings;
}

const getSettingsTemplate = (): SettingsTemplate => ({
  theme: {
    darkMode: false,
    accentColor: 'blue',
    autoThemeSettings: {
      enabled: false,
      startTime: '08:00',
      endTime: '20:00',
    },
  },
  table: {
    columnOrder: [],
    showSummaryRow: false,
    compactMode: false,
    stickyHeader: true,
  },
  ui: {
    animations: true,
    tooltips: true,
    confirmDelete: true,
  },
});

export { getSettingsTemplate };
