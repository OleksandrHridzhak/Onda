import type { IPlannerApi, DbChangeEvent, Column } from "@onda/shared";

// Fallback in-memory driver for browser dev/preview environment if Electron is not present
function createMemoryFallbackApi(): IPlannerApi {
  const listeners = new Set<(event: DbChangeEvent) => void>();
  console.warn(
    "[Onda API] Running in browser mode without Electron IPC bridge. Using in-memory fallback.",
  );

  return {
    columns: {
      getAll: async () => ({ success: true, data: [] }),
      getById: async (id) => ({
        success: false,
        error: `Column ${id} not found`,
      }),
      create: async (col) => ({
        success: true,
        data: { id: col.id || "temp-col-id", ...col } as Column,
      }),
      updateFields: async () => ({
        success: true,
        data: { updatedCount: 1 },
      }),
      archive: async (_id) => ({
        success: true,
        data: { columnId: _id },
      }),
      delete: async (_id) => ({ success: true, data: { columnId: _id } }),
      move: async () => ({ success: true, data: { columnsOrder: [] } }),
    },
    entries: {
      getEntriesForWeek: async () => ({ success: true, data: [] }),
      getEntriesForDateRange: async () => ({ success: true, data: [] }),
      upsertDayEntry: async (input) => ({
        success: true,
        data: {
          id: `${input.columnId}_${input.dayDate}`,
          columnId: input.columnId,
          scope: "day",
          dateKey: input.dayDate,
          dayDate: input.dayDate,
          weekStart: input.dayDate,
          valueType: input.valueType,
          value: input.value,
          meta: input.meta,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    },
    calendar: {
      getAll: async () => ({ success: true, data: [] }),
      save: async (event) => ({
        success: true,
        data: { id: "temp-id", ...event },
      }),
      delete: async (_id) => ({ success: true, data: { eventId: _id } }),
    },
    settings: {
      get: async () => ({
        success: true,
        data: { id: "global", layout: { columnsOrder: [] } },
      }),
      update: async () => ({ success: true, data: { updatedCount: 1 } }),
    },
    system: {
      clearAllData: async () => ({ success: true, data: true }),
    },
    onDbChange: (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}

let memoryFallbackApi: IPlannerApi | null = null;
function getTargetApi(): IPlannerApi {
  if (typeof window !== "undefined" && window.electronAPI?.db) {
    return window.electronAPI.db;
  }
  if (!memoryFallbackApi) {
    memoryFallbackApi = createMemoryFallbackApi();
  }
  return memoryFallbackApi;
}

export const api: IPlannerApi = new Proxy({} as IPlannerApi, {
  get(_target, prop: keyof IPlannerApi) {
    const target = getTargetApi();
    const value = target[prop];
    if (typeof value === "function") {
      return value.bind(target);
    }
    return value;
  },
});
