import type { IpcMain } from 'electron';
import { columnsService } from './columns.service';
import { entriesService } from './entries.service';
import { notifyDbChanged } from '../../core/events';

export function registerPlannerHandlers(ipcMain: IpcMain): void {
    // Columns handlers
    ipcMain.handle('db:columns:getAll', async () => columnsService.getAll());
    ipcMain.handle('db:columns:getById', async (_e, id: string) => columnsService.getById(id));
    ipcMain.handle('db:columns:getByIds', async (_e, ids: string[]) => columnsService.getByIds(ids));
    ipcMain.handle('db:columns:create', async (_e, col) => {
        const res = await columnsService.create(col);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'create' });
            notifyDbChanged({ table: 'settings', action: 'update' });
        }
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
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'update' });
            notifyDbChanged({ table: 'settings', action: 'update' });
        }
        return res;
    });
    ipcMain.handle('db:columns:delete', async (_e, id: string) => {
        const res = await columnsService.delete(id);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'delete' });
            notifyDbChanged({ table: 'settings', action: 'update' });
        }
        return res;
    });
    ipcMain.handle('db:columns:reorder', async (_e, order: string[]) => {
        const res = await columnsService.reorder(order);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'reorder' });
            notifyDbChanged({ table: 'settings', action: 'reorder' });
        }
        return res;
    });
    ipcMain.handle('db:columns:move', async (_e, columnId: string, direction: 'left' | 'right') => {
        const res = await columnsService.move(columnId, direction);
        if (res.success) {
            notifyDbChanged({ table: 'columns', action: 'reorder' });
            notifyDbChanged({ table: 'settings', action: 'reorder' });
        }
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
}
