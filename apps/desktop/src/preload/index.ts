import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI, DbChangeEvent, IPlannerApi } from "@onda/shared";

const dbApi: IPlannerApi = {
  columns: {
    getAll: () => ipcRenderer.invoke("db:columns:getAll"),
    getById: (id) => ipcRenderer.invoke("db:columns:getById", id),
    getByIds: (ids) => ipcRenderer.invoke("db:columns:getByIds", ids),
    create: (col) => ipcRenderer.invoke("db:columns:create", col),
    updateFields: (id, fields) =>
      ipcRenderer.invoke("db:columns:updateFields", id, fields),
    updateUniqueProps: (id, props) =>
      ipcRenderer.invoke("db:columns:updateUniqueProps", id, props),
    archive: (id, archivedAt) =>
      ipcRenderer.invoke("db:columns:archive", id, archivedAt),
    delete: (id) => ipcRenderer.invoke("db:columns:delete", id),
    reorder: (order) => ipcRenderer.invoke("db:columns:reorder", order),
    move: (columnId, direction) =>
      ipcRenderer.invoke("db:columns:move", columnId, direction),
  },
  entries: {
    getDayEntry: (columnId, dayDate) =>
      ipcRenderer.invoke("db:entries:getDayEntry", columnId, dayDate),
    getEntriesForWeek: (weekStart) =>
      ipcRenderer.invoke("db:entries:getEntriesForWeek", weekStart),
    getEntriesForDateRange: (startDate, endDate) =>
      ipcRenderer.invoke(
        "db:entries:getEntriesForDateRange",
        startDate,
        endDate,
      ),
    upsertDayEntry: (input) =>
      ipcRenderer.invoke("db:entries:upsertDayEntry", input),
    deleteEntriesForColumn: (columnId) =>
      ipcRenderer.invoke("db:entries:deleteEntriesForColumn", columnId),
  },
  calendar: {
    getAll: () => ipcRenderer.invoke("db:calendar:getAll"),
    getByDate: (date) => ipcRenderer.invoke("db:calendar:getByDate", date),
    getById: (id) => ipcRenderer.invoke("db:calendar:getById", id),
    getInRange: (startDate, endDate) =>
      ipcRenderer.invoke("db:calendar:getInRange", startDate, endDate),
    save: (event) => ipcRenderer.invoke("db:calendar:save", event),
    delete: (id) => ipcRenderer.invoke("db:calendar:delete", id),
  },
  settings: {
    get: () => ipcRenderer.invoke("db:settings:get"),
    update: (updates) => ipcRenderer.invoke("db:settings:update", updates),
    getColumnsOrder: () => ipcRenderer.invoke("db:settings:getColumnsOrder"),
    updateColumnsOrder: (columnIds) =>
      ipcRenderer.invoke("db:settings:updateColumnsOrder", columnIds),
  },
  system: {
    clearAllData: () => ipcRenderer.invoke("db:system:clearAllData"),
  },
  onDbChange: (callback: (event: DbChangeEvent) => void) => {
    const handler = (_event: any, data: DbChangeEvent) => callback(data);
    ipcRenderer.on("db:changed", handler);
    return () => {
      ipcRenderer.removeListener("db:changed", handler);
    };
  },
};

const electronAPI: ElectronAPI = {
  closeApp: () => ipcRenderer.invoke("close-app"),
  minimizeWindow: () => ipcRenderer.invoke("window-minimize"),
  maximizeWindow: () => ipcRenderer.invoke("window-maximize"),
  closeWindow: () => ipcRenderer.invoke("window-close"),
  showNotification: (options) =>
    ipcRenderer.invoke("show-notification", options),
  db: dbApi,
  onDbChange: dbApi.onDbChange,
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
