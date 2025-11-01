const getSettingsTemplates = () => ({
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

module.exports = {getSettingsTemplates };
