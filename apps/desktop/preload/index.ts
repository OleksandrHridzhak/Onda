import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '@onda/shared';

const electronAPI: ElectronAPI = {
    closeApp: () => ipcRenderer.invoke('close-app'),
    minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
    maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
    closeWindow: () => ipcRenderer.invoke('window-close'),
    showNotification: (options) =>
        ipcRenderer.invoke('show-notification', options),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
