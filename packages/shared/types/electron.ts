import type { IPlannerApi, DbChangeEvent } from "./api";

export interface ElectronNotificationOptions {
  title: string;
  body: string;
}

export interface ElectronAPI {
  closeApp: () => Promise<void>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  showNotification: (options: ElectronNotificationOptions) => Promise<void>;
  db: IPlannerApi;
  onDbChange: (callback: (event: DbChangeEvent) => void) => () => void;
}
