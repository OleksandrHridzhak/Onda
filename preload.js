const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Calendar Operations
  // Methods for managing calendar events and time
  calendarGetEvents: () => ipcRenderer.invoke('calendar-get-events'),
  calendarGetTime: () => ipcRenderer.invoke('calendar-get-time'),
  getTime: () => ipcRenderer.invoke('get-time'),
  calendarSaveEvent: (eventData) => ipcRenderer.invoke('calendar-save-event', eventData),
  calendarDeleteEvent: (eventId) => ipcRenderer.invoke('calendar-delete-event', eventId),

  // Table Operations
  // Methods for managing table data, components, and export/import
  getTableData: () => ipcRenderer.invoke('get-table-data'),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: (data) => ipcRenderer.invoke('import-data', data),
  changeColumn: (checkbox) => ipcRenderer.invoke('column-change', checkbox),
  createComponent: (type) => ipcRenderer.invoke('create-component', type),
  deleteComponent: (columnId) => ipcRenderer.invoke('delete-component', columnId),
  updateColumnOrder: (columnOrder) => ipcRenderer.invoke('update-column-order', columnOrder),
  getColumnById: (id) => ipcRenderer.invoke('get-column-by-id', id),

  // Settings Operations
  // Methods for managing themes, general settings, UI, and cell settings
  getTheme: () => ipcRenderer.invoke('get-theme'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  getCellSettings: () => ipcRenderer.invoke('get-cell-settings'),
  switchTheme: (darkMode) => ipcRenderer.invoke('switch-theme', darkMode),
  updateTableSettings: (tableSettings) => ipcRenderer.invoke('update-table-settings', tableSettings),
  updateTheme: (themeSettings) => ipcRenderer.invoke('update-theme', themeSettings),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  updateUISettings: (uiSettings) => ipcRenderer.invoke('update-ui-settings', uiSettings),

  // Window Management
  // Methods for controlling the application window and navigation (legacy comment: hell)
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  sendNextTab: () => ipcRenderer.send('next-tab'),
  onNextTab: (callback) => {
    ipcRenderer.on('next-tab', callback);
    return () => ipcRenderer.removeListener('next-tab', callback);
  }
});