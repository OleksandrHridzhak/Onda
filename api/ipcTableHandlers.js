const path = require('path');
const { getData, saveData } = require('../utils/dataUtils.js');
const DATA_FILE = path.join(__dirname, '../userData/data.json');

const { getColumnTemplates} = require('../constants/fileTemplates.js');

module.exports = {
  init(ipcMain) {
    // Save data to data.json
    ipcMain.handle('save-data', async (event, data) => {
      await saveData(DATA_FILE, data);
      return { status: 'Data saved!' };
    });
    // Get current time
    ipcMain.handle('get-time', () => {
      const now = new Date();
      return { time: now.toISOString() };
    });

    // Get all data from data.json
    ipcMain.handle('get-table-data', async() => {
      try {
        const data = await getData(DATA_FILE);
        return { status: 'Data fetched', data };
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }
    });
    ipcMain.handle('get-column-by-id', async(id) =>{
      try {
        const columns = await getData(DATA_FILE);
        const column = columns.find(col => col.ColumnId === id) || null
        return { status: 'Column by id was fetched', column };

      }catch(err){
        return { status: 'Error getting column by id', error: err.message };
      }

    });

    // Update a column in data.json
    ipcMain.handle('column-change', async (event, updatedColumn) => {
      const data = await getData(DATA_FILE);

      const index = data.findIndex(
        (item) => item.ColumnId === updatedColumn.ColumnId
      );

      if (index === -1) {
        return { status: 'Column not found' };
      }

      data[index] = updatedColumn;
      await saveData(DATA_FILE, data);
      return { status: 'Column updated', data: updatedColumn };
    });

    // Create a new component in data.json
    ipcMain.handle('create-component', async(event, type) => {

      const templates = getColumnTemplates();
      if (!templates[type]) {
        return { status: 'Invalid type', error: `No template for type "${type}"` };
      }

      const newComponent = templates[type];
      let data
      try {
        data = await getData(DATA_FILE);
      } catch (err) {
        return { status: 'Error parsing file', error: err.message };
      }

      data.push(newComponent);
      await saveData(DATA_FILE, data);
      return { status: 'Success', data: newComponent };
    });

    // Delete a component from data.json
    ipcMain.handle('delete-component', async (event, columnId) => {
      let data;
      try {
        data = await getData(DATA_FILE);
      } catch (err) {
        return { status: 'Error parsing data', error: err.message };
      }

      const initialLength = data.length;
      data = data.filter((item) => item.ColumnId !== columnId);

      if (data.length === initialLength) {
        return { status: 'Component not found', columnId };
      }
      await saveData(DATA_FILE, data);
      return { status: 'Component deleted', columnId };
    });

  }
};