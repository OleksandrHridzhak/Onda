const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),

  getAllDays: () => ipcRenderer.invoke('get-all-days'),
  changeColumn: (checkbox) => ipcRenderer.invoke('column-change', checkbox),
  createComponent: (type) => ipcRenderer.invoke('create-component', type),
  deleteComponent: (columnId) => ipcRenderer.invoke('delete-component', columnId),

  //hell
  // Додані нові функції для роsботи з вікном
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),

  // Функція для отримання точного часу
  getTime: () => ipcRenderer.invoke('get-time'),

  calendarGetEvents: () => ipcRenderer.invoke('calendar-get-events'),
  calendarSaveEvent: (eventData) => ipcRenderer.invoke('calendar-save-event', eventData),
  calendarDeleteEvent: (eventId) => ipcRenderer.invoke('calendar-delete-event', eventId),
  calendarGetTime: () => ipcRenderer.invoke('calendar-get-time'),

  switchTheme: (darkMode) => ipcRenderer.invoke('switch-theme', darkMode),
  getTheme: () => ipcRenderer.invoke('get-theme'),

  getCellSettings: () => ipcRenderer.invoke('get-cell-settings'),
  updateCellSettings: (cellId, newSettings) =>
    ipcRenderer.invoke('update-cell-settings', cellId, newSettings),
  deleteCellSettings: (cellId) =>
    ipcRenderer.invoke('delete-cell-settings', cellId),

  // New API endpoints for column order management
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  updateColumnOrder: (columnOrder) => ipcRenderer.invoke('update-column-order', columnOrder),
});
