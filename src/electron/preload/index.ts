import { contextBridge, ipcRenderer } from 'electron';

interface NotificationOptions {
    title: string;
    body: string;
}

export interface ElectronAPI {
    closeApp: () => Promise<void>;
    minimizeWindow: () => Promise<void>;
    maximizeWindow: () => Promise<void>;
    closeWindow: () => Promise<void>;
    showNotification: (options: NotificationOptions) => Promise<void>;
}

const electronAPI: ElectronAPI = {
    closeApp: () => ipcRenderer.invoke('close-app'),
    minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
    maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
    closeWindow: () => ipcRenderer.invoke('window-close'),
    showNotification: (options) =>
        ipcRenderer.invoke('show-notification', options),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
