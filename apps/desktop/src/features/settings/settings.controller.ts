import type { IpcMainInvokeEvent } from 'electron';
import type { Setting } from '@onda/shared';
import { getSettings, getColumnsOrder } from './services/get-settings';
import { updateSettings, updateColumnsOrder } from './services/update-settings';
import { notifyDbChanged } from '../../core/events';

export const settingsController = {
    async get() {
        return getSettings();
    },

    async update(_e: IpcMainInvokeEvent, updates: Partial<Omit<Setting, 'id'>>) {
        const res = await updateSettings(updates);
        if (res.success) notifyDbChanged({ table: 'settings', action: 'update' });
        return res;
    },

    async getColumnsOrder() {
        return getColumnsOrder();
    },

    async updateColumnsOrder(_e: IpcMainInvokeEvent, columnIds: string[]) {
        const res = await updateColumnsOrder(columnIds);
        if (res.success) notifyDbChanged({ table: 'settings', action: 'reorder' });
        return res;
    },
};
