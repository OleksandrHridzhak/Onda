import { dbPromise } from './indexedDB.js';

const handleError = (err, message) => ({
  status: 'error',
  error: err.message || message,
});

export const calendarService = {
  async initCalendar() {
    try {
      const db = await dbPromise;
      const tx = db.transaction('calendar', 'readwrite');
      const store = tx.objectStore('calendar');

      const existing = await store.get(1);
      if (!existing) {
        await store.put({ id: 1, body: [] });
      }

      await tx.done;
      return { status: 'Calendar initialized' };
    } catch (err) {
      return handleError(err, 'Error initializing calendar');
    }
  },

  async getCalendar() {
    try {
      const db = await dbPromise;
      const store = db
        .transaction('calendar', 'readonly')
        .objectStore('calendar');

      let calendar = await store.get(1);

      if (!calendar) {
        // якщо нема – створюємо порожній об’єкт
        const tx = db.transaction('calendar', 'readwrite');
        const writeStore = tx.objectStore('calendar');
        calendar = { id: 1, body: [] };
        await writeStore.put(calendar);
        await tx.done;
      }

      return { status: 'success', data: calendar.body };
    } catch (err) {
      return handleError(err, 'Error fetching calendar');
    }
  },

  async updateCalendarEvent(eventData) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('calendar', 'readwrite');
      const store = tx.objectStore('calendar');

      let calendar = await store.get(1);
      if (!calendar) {
        calendar = { id: 1, body: [] };
      }

      // нормалізуємо
      const normalizedEvent = {
        ...eventData,
        id: eventData.id || Date.now().toString(),
        isRepeating: eventData.isRepeating ?? false,
        repeatDays: eventData.isRepeating
          ? Array.isArray(eventData.repeatDays)
            ? eventData.repeatDays
            : []
          : [],
        repeatFrequency: eventData.isRepeating
          ? eventData.repeatFrequency || 'weekly'
          : 'weekly',
      };

      // перевіряємо, чи є вже така подія
      const index = calendar.body.findIndex((e) => e.id === normalizedEvent.id);
      if (index !== -1) {
        calendar.body[index] = normalizedEvent;
      } else {
        calendar.body.push(normalizedEvent);
      }

      await store.put(calendar);
      await tx.done;

      return { status: 'success', data: normalizedEvent };
    } catch (err) {
      return handleError(err, 'Error updating calendar event');
    }
  },

  async deleteCalendarEvent(eventId) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('calendar', 'readwrite');
      const store = tx.objectStore('calendar');

      let calendar = await store.get(1);
      if (!calendar) {
        return { status: 'error', message: 'Calendar not found' };
      }

      const initialLength = calendar.body.length;
      calendar.body = calendar.body.filter((event) => event.id !== eventId);

      if (calendar.body.length === initialLength) {
        return { status: 'error', message: 'Event not found' };
      }

      await store.put(calendar);
      await tx.done;

      return { status: 'Calendar event deleted', eventId };
    } catch (err) {
      return handleError(err, 'Error deleting calendar event');
    }
  },

  async getCalendarTime() {
    try {
      const now = new Date();
      return { status: 'Calendar time fetched', time: now.toISOString() };
    } catch (err) {
      return handleError(err, 'Error fetching calendar time');
    }
  },
};
