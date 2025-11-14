interface ElectronAPI {
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  closeApp: () => Promise<void>;
  showNotification: (options: { title: string; body: string }) => void;
  // Додай інші методи які використовуються в проекті
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
