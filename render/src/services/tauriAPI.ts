import { invoke } from '@tauri-apps/api/core';
import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from '@tauri-apps/plugin-notification';
import type { PermissionState } from '@tauri-apps/plugin-notification';

export const tauriAPI = {
  minimizeWindow: async () => {
    await invoke('minimize_window');
  },

  maximizeWindow: async () => {
    await invoke('maximize_window');
  },

  closeWindow: async () => {
    await invoke('close_window');
  },

  closeApp: async () => {
    await invoke('close_app');
  },

  showNotification: async (options: { title: string; body: string }) => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      await sendNotification(options);
    }
  },
};

// Make it available globally for compatibility
if (typeof window !== 'undefined') {
  (window as any).electronAPI = tauriAPI;
}

export default tauriAPI;
