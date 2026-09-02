import type { IpcMain } from 'electron';
import { settingsService } from './settings.service';
import { notifyDbChanged } from '../../core/events';

export function registerSettingsHandlers(ipcMain: IpcMain): void {
    ipcMain.handle('db:settings:get', async () => settingsService.get());
    ipcMain.handle('db:settings:update', async (_e, updates) => {
        const res = await settingsService.update(updates);
        if (res.success) notifyDbChanged({ table: 'settings', action: 'update' });
        return res;
    });
    ipcMain.handle('db:settings:getColumnsOrder', async () => settingsService.getColumnsOrder());
    ipcMain.handle('db:settings:updateColumnsOrder', async (_e, columnIds: string[]) => {
        const res = await settingsService.updateColumnsOrder(columnIds);
        if (res.success) notifyDbChanged({ table: 'settings', action: 'reorder' });
        return res;
    });
}
