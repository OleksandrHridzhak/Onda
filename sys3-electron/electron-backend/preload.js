const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),

  // Додаємо нові методи для експорту та імпорту
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: (data) => ipcRenderer.invoke('import-data', data),

  getAllDays: () => ipcRenderer.invoke('get-all-days'),
  changeColumn: (checkbox) => ipcRenderer.invoke('column-change', checkbox),
  createComponent: (type) => ipcRenderer.invoke('create-component', type),
  deleteComponent: (columnId) => ipcRenderer.invoke('delete-component', columnId),

  //hell
  // Додані нові функції для роsботи з вікном
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),

  // Функція для отримання точного часу
  getTime: () => ipcRenderer.invoke('get-time'),

  calendarGetEvents: () => ipcRenderer.invoke('calendar-get-events'),
  calendarSaveEvent: (eventData) => ipcRenderer.invoke('calendar-save-event', eventData),
  calendarDeleteEvent: (eventId) => ipcRenderer.invoke('calendar-delete-event', eventId),
  calendarGetTime: () => ipcRenderer.invoke('calendar-get-time'),

  // Theme settings
  switchTheme: (darkMode) => ipcRenderer.invoke('switch-theme', darkMode),
  getTheme: () => ipcRenderer.invoke('get-theme'),
  updateTheme: (themeSettings) => ipcRenderer.invoke('update-theme', themeSettings),

  // Table settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  updateTableSettings: (tableSettings) => ipcRenderer.invoke('update-table-settings', tableSettings),
  updateColumnOrder: (columnOrder) => ipcRenderer.invoke('update-column-order', columnOrder),

  // UI settings
  updateUISettings: (uiSettings) => ipcRenderer.invoke('update-ui-settings', uiSettings),

  getCellSettings: () => ipcRenderer.invoke('get-cell-settings'),
  updateCellSettings: (cellId, newSettings) =>
    ipcRenderer.invoke('update-cell-settings', cellId, newSettings),
  deleteCellSettings: (cellId) =>
    ipcRenderer.invoke('delete-cell-settings', cellId),


  onNextTab: (callback) => ipcRenderer.on('next-tab', callback)

});
