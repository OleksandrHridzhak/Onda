import { getDatabase } from '../database/rxdb';

/**
 * Service for managing calendar in RxDB
 * Provides backward-compatible API with the old calendarDB.js
 */

const handleError = (err: any, message: string) => ({
  status: 'error' as const,
  error: err.message || message,
});

export const calendarService = {
  async initCalendar() {
    try {
      // Calendar is initialized by migration, so this is a no-op
      return { status: 'Calendar initialized' as const };
    } catch (err) {
      return handleError(err, 'Error initializing calendar');
    }
  },

  async getCalendar(): Promise<
    { status: 'success'; data: any[] } | { status: 'error'; error: string }
  > {
    try {
      const db = await getDatabase();
      const doc = await db.calendar.findOne('1').exec();

      if (!doc) {
        // Create empty calendar if not exists
        await db.calendar.upsert({
          _id: '1',
          body: [],
        });
        return { status: 'success' as const, data: [] };
      }

      const data = doc.toJSON();
      return { status: 'success' as const, data: data.body };
    } catch (err) {
      return handleError(err, 'Error fetching calendar');
    }
  },

  async saveCalendar(calendar: any[]) {
    try {
      const db = await getDatabase();
      const doc = await db.calendar.findOne('1').exec();

      if (!doc) {
        // Create if doesn't exist
        await db.calendar.upsert({
          _id: '1',
          body: calendar,
        });
      } else {
        // Update existing
        await doc.update({
          $set: {
            body: calendar,
          },
        });
      }

      return { status: 'success' as const };
    } catch (err) {
      return handleError(err, 'Error saving calendar');
    }
  },

  async updateCalendar(calendar: any[]) {
    return this.saveCalendar(calendar);
  },

  async updateCalendarEvent(eventData: any) {
    try {
      const db = await getDatabase();
      const doc = await db.calendar.findOne('1').exec();

      let calendar = doc ? doc.toJSON() : { _id: '1', body: [] };

      // Normalize event data
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

      // Check if event already exists
      const index = calendar.body.findIndex(
        (e: any) => e.id === normalizedEvent.id,
      );
      if (index !== -1) {
        calendar.body[index] = normalizedEvent;
      } else {
        calendar.body.push(normalizedEvent);
      }

      if (doc) {
        await doc.update({
          $set: {
            body: calendar.body,
          },
        });
      } else {
        await db.calendar.upsert({
          _id: '1',
          body: calendar.body,
        });
      }

      return { status: 'success' as const, data: normalizedEvent };
    } catch (err) {
      return handleError(err, 'Error updating calendar event');
    }
  },

  async deleteCalendarEvent(eventId: string | number) {
    try {
      const db = await getDatabase();
      const doc = await db.calendar.findOne('1').exec();

      if (!doc) {
        return { status: 'error' as const, error: 'Calendar not found' };
      }

      const calendar = doc.toJSON();
      const initialLength = calendar.body.length;
      calendar.body = calendar.body.filter(
        (event: any) => event.id !== eventId,
      );

      if (calendar.body.length === initialLength) {
        return { status: 'error' as const, error: 'Event not found' };
      }

      await doc.update({
        $set: {
          body: calendar.body,
        },
      });

      return { status: 'success' as const, eventId };
    } catch (err) {
      return handleError(err, 'Error deleting calendar event');
    }
  },

  async getCalendarTime() {
    try {
      const now = new Date();
      return {
        status: 'Calendar time fetched' as const,
        time: now.toISOString(),
      };
    } catch (err) {
      return handleError(err, 'Error fetching calendar time');
    }
  },

  async clearCalendar() {
    try {
      const db = await getDatabase();
      const doc = await db.calendar.findOne('1').exec();

      if (doc) {
        await doc.update({
          $set: {
            body: [],
          },
        });
      }

      return { status: 'success' as const };
    } catch (err) {
      return handleError(err, 'Error clearing calendar');
    }
  },
};
