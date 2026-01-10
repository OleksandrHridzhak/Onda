/**
 * React Hook for Calendar Data
 *
 * Provides reactive access to calendar events from RxDB.
 * Automatically updates when data changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { getDatabase, CalendarEvent } from '../index';
import { notifyDataChange } from '../../services/autoSync';

export interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
}

export function useCalendarEvents() {
  const [state, setState] = useState<CalendarState>({
    events: [],
    isLoading: true,
    error: null,
  });

  // Load data and subscribe to changes
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    let mounted = true;

    const init = async () => {
      try {
        const db = await getDatabase();

        // Subscribe to calendar events changes
        subscription = db.calendar.find().$.subscribe((docs) => {
          if (!mounted) return;
          const events = docs.map((doc) => doc.toJSON());
          setState({
            events,
            isLoading: false,
            error: null,
          });
        });
      } catch (error) {
        if (mounted) {
          setState({
            events: [],
            isLoading: false,
            error: (error as Error).message,
          });
        }
      }
    };

    init();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Create or update an event
  const upsertEvent = useCallback(
    async (eventData: Partial<CalendarEvent> & { id?: string }) => {
      try {
        const db = await getDatabase();

        const event: CalendarEvent = {
          id: eventData.id || Date.now().toString(),
          title: eventData.title || '',
          date: eventData.date || new Date().toDateString(),
          startTime: eventData.startTime || '09:00',
          endTime: eventData.endTime || '10:00',
          color: eventData.color || '#2563eb',
          isRepeating: eventData.isRepeating ?? false,
          repeatDays: eventData.repeatDays || [],
          repeatFrequency: eventData.repeatFrequency || 'weekly',
          updatedAt: Date.now(),
        };

        await db.calendar.upsert(event);
        notifyDataChange();

        return event;
      } catch (error) {
        console.error('Error upserting calendar event:', error);
        throw error;
      }
    },
    [],
  );

  // Delete an event
  const deleteEvent = useCallback(async (eventId: string | number) => {
    try {
      const db = await getDatabase();
      const doc = await db.calendar.findOne(eventId.toString()).exec();

      if (doc) {
        await doc.remove();
        notifyDataChange();
      }

      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }, []);

  // Get all events
  const getEvents = useCallback(async () => {
    try {
      const db = await getDatabase();
      const docs = await db.calendar.find().exec();
      return docs.map((doc) => doc.toJSON());
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    upsertEvent,
    deleteEvent,
    getEvents,
  };
}
