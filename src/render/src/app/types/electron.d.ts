interface ElectronAPI {
    minimizeWindow: () => Promise<void>;
    maximizeWindow: () => Promise<void>;
    closeWindow: () => Promise<void>;
    closeApp: () => Promise<void>;
    showNotification: (options: {
        title: string;
        body: string;
    }) => Promise<void>;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}

export {};
