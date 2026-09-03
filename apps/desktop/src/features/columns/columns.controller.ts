import type { IpcMainInvokeEvent } from 'electron';
import type { Column } from '@onda/shared';
import { getAllColumns, getColumnById, getColumnsByIds } from './services/get-columns';
import { createColumn } from './services/create-column';
import { updateColumnFields, updateColumnUniqueProps, archiveColumn } from './services/update-column';
import { deleteColumn } from './services/delete-column';
import { reorderColumns, moveColumn } from './services/reorder-columns';
import { notifyDbChanged } from '../../core/lib/events';

export const columnsController = {
    async getAllColumns() {
        return getAllColumns();
    },

    async getColumnById(_e: IpcMainInvokeEvent, id: string) {
        return getColumnById(id);
    },

    async getColumnsByIds(_e: IpcMainInvokeEvent, ids: string[]) {
        return getColumnsByIds(ids);
    },

    async createColumn(_e: IpcMainInvokeEvent, col: Column) {
        const res = await createColumn(col);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'create' });
            notifyDbChanged({ table: 'settings', action: 'update' });
        }
        return res;
    },

    async updateColumnFields(_e: IpcMainInvokeEvent, id: string, fields: Partial<Column>) {
        const res = await updateColumnFields(id, fields);
        if (res.success) notifyDbChanged({ table: 'columns', action: 'update' });
        return res;
    },

    async updateColumnUniqueProps(_e: IpcMainInvokeEvent, id: string, props: unknown) {
        const res = await updateColumnUniqueProps(id, props);
        if (res.success) notifyDbChanged({ table: 'columns', action: 'update' });
        return res;
    },

    async archiveColumn(_e: IpcMainInvokeEvent, id: string, archivedAt: string) {
        const res = await archiveColumn(id, archivedAt);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'update' });
            notifyDbChanged({ table: 'settings', action: 'update' });
        }
        return res;
    },

    async deleteColumn(_e: IpcMainInvokeEvent, id: string) {
        const res = await deleteColumn(id);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'delete' });
            notifyDbChanged({ table: 'settings', action: 'update' });
        }
        return res;
    },

    async reorderColumns(_e: IpcMainInvokeEvent, order: string[]) {
        const res = await reorderColumns(order);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'reorder' });
            notifyDbChanged({ table: 'settings', action: 'reorder' });
        }
        return res;
    },

    async moveColumn(_e: IpcMainInvokeEvent, columnId: string, direction: 'left' | 'right') {
        const res = await moveColumn(columnId, direction);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'reorder' });
            notifyDbChanged({ table: 'settings', action: 'reorder' });
        }
        return res;
    },
};
