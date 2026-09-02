import type { IpcMain, BrowserWindow } from 'electron';
import { columnsService } from '../services/columns.service';
import { entriesService } from '../services/entries.service';
import { calendarService } from '../services/calendar.service';
import { settingsService } from '../services/settings.service';
import { systemService } from '../services/system.service';
import type { DbChangeEvent } from '@onda/shared';

let activeWindow: BrowserWindow | null = null;

export function notifyDbChanged(event: DbChangeEvent): void {
    if (activeWindow && !activeWindow.isDestroyed()) {
        activeWindow.webContents.send('db:changed', event);
    }
}

export const dbHandlers = {
    register(ipcMain: IpcMain, window: BrowserWindow): void {
        activeWindow = window;

        // Columns handlers
        ipcMain.handle('db:columns:getAll', async () => columnsService.getAll());
        ipcMain.handle('db:columns:getById', async (_e, id: string) => columnsService.getById(id));
        ipcMain.handle('db:columns:getByIds', async (_e, ids: string[]) => columnsService.getByIds(ids));
        ipcMain.handle('db:columns:create', async (_e, col) => {
            const res = await columnsService.create(col);
            if (res.success) notifyDbChanged({ table: 'columns', action: 'create' });
            return res;
        });
        ipcMain.handle('db:columns:updateFields', async (_e, id: string, fields) => {
            const res = await columnsService.updateFields(id, fields);
            if (res.success) notifyDbChanged({ table: 'columns', action: 'update' });
            return res;
        });
        ipcMain.handle('db:columns:updateUniqueProps', async (_e, id: string, props) => {
            const res = await columnsService.updateUniqueProps(id, props);
            if (res.success) notifyDbChanged({ table: 'columns', action: 'update' });
            return res;
        });
        ipcMain.handle('db:columns:archive', async (_e, id: string, archivedAt: string) => {
            const res = await columnsService.archive(id, archivedAt);
            if (res.success) notifyDbChanged({ table: 'columns', action: 'update' });
            return res;
        });
        ipcMain.handle('db:columns:delete', async (_e, id: string) => {
            const res = await columnsService.delete(id);
            if (res.success) notifyDbChanged({ table: 'columns', action: 'delete' });
            return res;
        });
        ipcMain.handle('db:columns:reorder', async (_e, order: string[]) => {
            const res = await columnsService.reorder(order);
            if (res.success) notifyDbChanged({ table: 'columns', action: 'reorder' });
            return res;
        });
        ipcMain.handle('db:columns:move', async (_e, columnId: string, direction: 'left' | 'right') => {
            const res = await columnsService.move(columnId, direction);
            if (res.success) notifyDbChanged({ table: 'columns', action: 'reorder' });
            return res;
        });

        // Entries handlers
        ipcMain.handle('db:entries:getDayEntry', async (_e, columnId: string, dayDate: string) =>
            entriesService.getDayEntry(columnId, dayDate),
        );
        ipcMain.handle('db:entries:getEntriesForWeek', async (_e, weekStart: string) =>
            entriesService.getEntriesForWeek(weekStart),
        );
        ipcMain.handle('db:entries:getEntriesForDateRange', async (_e, startDate: string, endDate: string) =>
            entriesService.getEntriesForDateRange(startDate, endDate),
        );
        ipcMain.handle('db:entries:upsertDayEntry', async (_e, input) => {
            const res = await entriesService.upsertDayEntry(input);
            if (res.success) notifyDbChanged({ table: 'entries', action: 'update' });
            return res;
        });
        ipcMain.handle('db:entries:deleteEntriesForColumn', async (_e, columnId: string) => {
            const res = await entriesService.deleteEntriesForColumn(columnId);
            if (res.success) notifyDbChanged({ table: 'entries', action: 'delete' });
            return res;
        });

        // Calendar handlers
        ipcMain.handle('db:calendar:getAll', async () => calendarService.getAll());
        ipcMain.handle('db:calendar:getByDate', async (_e, date: string) => calendarService.getByDate(date));
        ipcMain.handle('db:calendar:getById', async (_e, id: string) => calendarService.getById(id));
        ipcMain.handle('db:calendar:getInRange', async (_e, startDate: string, endDate: string) =>
            calendarService.getInRange(startDate, endDate),
        );
        ipcMain.handle('db:calendar:create', async (_e, event) => {
            const res = await calendarService.create(event);
            if (res.success) notifyDbChanged({ table: 'calendar', action: 'create' });
            return res;
        });
        ipcMain.handle('db:calendar:update', async (_e, id: string, updates) => {
            const res = await calendarService.update(id, updates);
            if (res.success) notifyDbChanged({ table: 'calendar', action: 'update' });
            return res;
        });
        ipcMain.handle('db:calendar:save', async (_e, event) => {
            const res = await calendarService.save(event);
            if (res.success) notifyDbChanged({ table: 'calendar', action: 'update' });
            return res;
        });
        ipcMain.handle('db:calendar:delete', async (_e, id: string) => {
            const res = await calendarService.delete(id);
            if (res.success) notifyDbChanged({ table: 'calendar', action: 'delete' });
            return res;
        });

        // Settings handlers
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

        // System handlers
        ipcMain.handle('db:system:clearAllData', async () => {
            const res = await systemService.clearAllData();
            if (res.success) notifyDbChanged({ table: 'all', action: 'clear' });
            return res;
        });
    },
};
