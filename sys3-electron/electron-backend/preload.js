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
  calendarGetTime: () => ipcRenderer.invoke('calendar-get-time')
});
