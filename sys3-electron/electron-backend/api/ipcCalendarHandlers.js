const fs = require('fs');
const path = require('path');
const { app, ipcMain } = require('electron');
const { ensureDataFileExists, saveData, getData } = require('../utils/dataUtils');
const DATA_FILE = path.join(__dirname, '../userData/calendar.json');




module.exports = {
  init(ipcMain, mainWindow) {
    // Get all calendar events
    ipcMain.handle('calendar-get-events', async () => {
      try {
        const data = await getData(DATA_FILE);
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

        let events = await getData(DATA_FILE);

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

        await saveData(DATA_FILE, events);
        return { status: 'success', data: normalizedEvent };
      } catch (error) {
        return { status: 'error', error: error.message };
      }
    });

    // Delete a single calendar event
    ipcMain.handle('calendar-delete-event', async (event, eventId) => {
      try {
        let events = await getData(DATA_FILE);

        const initialLength = events.length;
        events = events.filter((e) => e.id !== eventId);

        if (events.length === initialLength) {
          return { status: 'error', message: 'Event not found' };
        }

        await saveData(DATA_FILE, events);
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
  },
};