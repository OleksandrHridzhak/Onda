import type { IpcMainInvokeEvent } from "electron";
import type { Setting } from "@onda/shared";
import { getSettings } from "./services/get-settings";
import { updateSettings } from "./services/update-settings";
import { notifyDbChanged } from "../../core/lib/events";

export const settingsController = {
  async get() {
    return getSettings();
  },

  async update(_e: IpcMainInvokeEvent, updates: Partial<Omit<Setting, "id">>) {
    const res = await updateSettings(updates);
    if (res.success) notifyDbChanged({ table: "settings", action: "update" });
    return res;
  },
};
