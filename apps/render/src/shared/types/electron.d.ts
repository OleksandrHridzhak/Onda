import type { ElectronAPI } from '@onda/shared';

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}

export {};
