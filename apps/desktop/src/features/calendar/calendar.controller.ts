import type { IpcMainInvokeEvent } from "electron";
import type { CalendarEntry } from "@onda/shared";
import { getCalendarEvents } from "./services/get-calendar-events";
import { saveCalendarEvent } from "./services/save-calendar-event";
import { deleteCalendarEvent } from "./services/delete-calendar-event";
import { notifyDbChanged } from "../../core/lib/events";

export const calendarController = {
  async getAll() {
    return getCalendarEvents();
  },

  async save(
    _e: IpcMainInvokeEvent,
    event: CalendarEntry | Omit<CalendarEntry, "id">,
  ) {
    const res = await saveCalendarEvent(event);
    if (res.success) notifyDbChanged({ table: "calendar", action: "update" });
    return res;
  },

  async delete(_e: IpcMainInvokeEvent, id: string) {
    const res = await deleteCalendarEvent(id);
    if (res.success) notifyDbChanged({ table: "calendar", action: "delete" });
    return res;
  },
};
