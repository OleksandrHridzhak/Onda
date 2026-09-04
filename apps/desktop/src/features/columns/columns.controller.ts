import type { IpcMainInvokeEvent } from "electron";
import type { Column } from "@onda/shared";
import {
  getAllColumns,
  getColumnById,
} from "./services/get-columns";
import { createColumn } from "./services/create-column";
import { updateColumnFields, archiveColumn } from "./services/update-column";
import { deleteColumn } from "./services/delete-column";
import { moveColumn } from "./services/reorder-columns";
import { notifyDbChanged } from "../../core/lib/events";

export const columnsController = {
  async getAllColumns() {
    return getAllColumns();
  },

  async getColumnById(_e: IpcMainInvokeEvent, id: string) {
    return getColumnById(id);
  },

  async createColumn(_e: IpcMainInvokeEvent, col: Column) {
    const res = await createColumn(col);
    if (res.success) {
      notifyDbChanged({ table: "columns", action: "create" });
      notifyDbChanged({ table: "settings", action: "update" });
    }
    return res;
  },

  async updateColumnFields(
    _e: IpcMainInvokeEvent,
    id: string,
    fields: Partial<Column>,
  ) {
    const res = await updateColumnFields(id, fields);
    if (res.success) notifyDbChanged({ table: "columns", action: "update" });
    return res;
  },

  async archiveColumn(_e: IpcMainInvokeEvent, id: string) {
    const res = await archiveColumn(id);
    if (res.success) {
      notifyDbChanged({ table: "columns", action: "update" });
      notifyDbChanged({ table: "settings", action: "update" });
    }
    return res;
  },

  async deleteColumn(_e: IpcMainInvokeEvent, id: string) {
    const res = await deleteColumn(id);
    if (res.success) {
      notifyDbChanged({ table: "columns", action: "delete" });
      notifyDbChanged({ table: "settings", action: "update" });
    }
    return res;
  },

  async moveColumn(
    _e: IpcMainInvokeEvent,
    columnId: string,
    direction: "left" | "right",
  ) {
    const res = await moveColumn(columnId, direction);
    if (res.success) {
      notifyDbChanged({ table: "columns", action: "reorder" });
      notifyDbChanged({ table: "settings", action: "reorder" });
    }
    return res;
  },
};
