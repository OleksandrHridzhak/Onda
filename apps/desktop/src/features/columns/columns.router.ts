import type { IpcMain } from 'electron';
import { columnsController } from './columns.controller';

export function registerColumnsHandlers(ipcMain: IpcMain): void {
    ipcMain.handle('db:columns:getAll', columnsController.getAllColumns);
    ipcMain.handle('db:columns:getById', columnsController.getColumnById);
    ipcMain.handle('db:columns:getByIds', columnsController.getColumnsByIds);
    ipcMain.handle('db:columns:create', columnsController.createColumn);
    ipcMain.handle('db:columns:updateFields', columnsController.updateColumnFields);
    ipcMain.handle('db:columns:updateUniqueProps', columnsController.updateColumnUniqueProps);
    ipcMain.handle('db:columns:archive', columnsController.archiveColumn);
    ipcMain.handle('db:columns:delete', columnsController.deleteColumn);
    ipcMain.handle('db:columns:reorder', columnsController.reorderColumns);
    ipcMain.handle('db:columns:move', columnsController.moveColumn);
}
