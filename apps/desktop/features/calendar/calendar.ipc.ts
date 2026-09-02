import type { IpcMain } from 'electron';
import { calendarService } from './calendar.service';
import { notifyDbChanged } from '../../core/events';

export function registerCalendarHandlers(ipcMain: IpcMain): void {
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
}
