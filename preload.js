const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  closeApp: () => ipcRenderer.invoke('close-app'),


  // Window Management
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  sendNextTab: () => ipcRenderer.send('next-tab'),
  onNextTab: (callback) => {
    ipcRenderer.on('next-tab', callback);
    return () => ipcRenderer.removeListener('next-tab', callback);
  },

  //Metric colection
  collectMetrics: (event, data) => ipcRenderer.invoke('collect-metrics', event, data),
  // preload.js

});
