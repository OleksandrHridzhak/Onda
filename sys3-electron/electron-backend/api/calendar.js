const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

const DATA_FILE = path.join(__dirname, '../userData/calendar.json');


const ensureDataFileExists = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

module.exports = {
  init(ipcMain, mainWindow) {
    // Get all calendar events
    ipcMain.handle('calendar-get-events', async () => {
      try {
        ensureDataFileExists();
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        // Ensure backward compatibility
        const normalizedData = data.map(event => ({
          ...event,
          isRepeating: event.isRepeating ?? false,
          repeatDays: event.repeatDays ?? [],
          repeatFrequency: event.repeatFrequency ?? 'weekly'
        }));
        return { status: 'success', data: normalizedData };
      } catch (error) {
        return { status: 'error', error: error.message };
      }
    });

    // Save or update a single calendar event
    ipcMain.handle('calendar-save-event', async (event, eventData) => {
      try {
        ensureDataFileExists();
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        let events = JSON.parse(fileContent);

        // Validate repeat settings
        const normalizedEvent = {
          ...eventData,
          isRepeating: eventData.isRepeating ?? false,
          repeatDays: eventData.isRepeating ? (Array.isArray(eventData.repeatDays) ? eventData.repeatDays : []) : [],
          repeatFrequency: eventData.isRepeating ? (eventData.repeatFrequency || 'weekly') : 'weekly'
        };

        const index = events.findIndex((e) => e.id === eventData.id);
        if (index !== -1) {
          // Update existing event
          events[index] = normalizedEvent;
        } else {
          // Add new event
          events.push({ ...normalizedEvent, id: eventData.id || Date.now().toString() });
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
        return { status: 'success', data: normalizedEvent };
      } catch (error) {
        return { status: 'error', error: error.message };
      }
    });

    // Delete a single calendar event
    ipcMain.handle('calendar-delete-event', async (event, eventId) => {
      try {
        ensureDataFileExists();
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        let events = JSON.parse(fileContent);

        const initialLength = events.length;
        events = events.filter((e) => e.id !== eventId);

        if (events.length === initialLength) {
          return { status: 'error', message: 'Event not found' };
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
        return { status: 'success', message: 'Event deleted', eventId };
      } catch (error) {
        return { status: 'error', error: error.message };
      }
    });

    // Get current time
    ipcMain.handle('calendar-get-time', async () => {
      const now = new Date();
      return { status: 'success', time: now.toISOString() };
    });

    // Window controls
    ipcMain.handle('calendar-window-close', () => {
      app.quit();
    });

    ipcMain.handle('calendar-window-minimize', () => {
      mainWindow.minimize();
    });

    ipcMain.handle('calendar-window-maximize', () => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    });
  },
};