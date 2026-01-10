import { useState, useCallback } from 'react';
import { useCalendarEvents } from '../../../../database';

// UI-facing CalendarEvent type (without database-specific fields)
export interface CalendarEvent {
  id: string | number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: string;
}

export interface NewEvent {
  title: string;
  date?: string;
  startTime: string;
  endTime: string;
  color: string;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: string;
}

export function useCalendar() {
  const {
    events: dbEvents,
    isLoading,
    error,
    upsertEvent,
    deleteEvent: removeEvent,
  } = useCalendarEvents();

  // Convert DB events to UI events
  const events: CalendarEvent[] = dbEvents.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    startTime: e.startTime,
    endTime: e.endTime,
    color: e.color,
    isRepeating: e.isRepeating,
    repeatDays: e.repeatDays,
    repeatFrequency: e.repeatFrequency,
  }));

  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    color: '#2563eb',
    isRepeating: false,
    repeatDays: [],
    repeatFrequency: 'weekly',
  });

  const createOrUpdateEvent = useCallback(
    async (
      payload: NewEvent & { id?: string | number },
    ): Promise<CalendarEvent | null> => {
      try {
        const event = await upsertEvent({
          id: payload.id?.toString(),
          title: payload.title,
          date: payload.date || new Date().toDateString(),
          startTime: payload.startTime,
          endTime: payload.endTime,
          color: payload.color,
          isRepeating: !!payload.isRepeating,
          repeatDays: payload.repeatDays || [],
          repeatFrequency: payload.repeatFrequency || 'weekly',
        });

        setShowEventModal(false);
        setNewEvent({
          title: '',
          startTime: '09:00',
          endTime: '10:00',
          color: '#2563eb',
          isRepeating: false,
          repeatDays: [],
          repeatFrequency: 'weekly',
        });
        setEditingEventId(null);

        return event;
      } catch (e) {
        console.error('Error saving event:', e);
        return null;
      }
    },
    [upsertEvent],
  );

  const deleteEvent = useCallback(
    async (eventId: string | number): Promise<boolean> => {
      try {
        await removeEvent(eventId);
        setShowEventModal(false);
        setNewEvent({
          title: '',
          startTime: '09:00',
          endTime: '10:00',
          color: '#2563eb',
          isRepeating: false,
          repeatDays: [],
          repeatFrequency: 'weekly',
        });
        setEditingEventId(null);
        return true;
      } catch (e) {
        console.error('Error deleting event:', e);
        return false;
      }
    },
    [removeEvent],
  );

  const validateTime = useCallback((time: string): boolean => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  }, []);

  const adjustEventTimes = useCallback((delta: number): void => {
    const shift = (time: string): string => {
      const [h, m] = time.split(':').map(Number);
      let total = h * 60 + m + delta;
      if (total < 0) total += 24 * 60;
      if (total >= 24 * 60) total -= 24 * 60;
      const nh = Math.floor(total / 60)
        .toString()
        .padStart(2, '0');
      const nm = (total % 60).toString().padStart(2, '0');
      return nh + ':' + nm;
    };
    setNewEvent((prev) => ({
      ...prev,
      startTime: shift(prev.startTime),
      endTime: shift(prev.endTime),
    }));
  }, []);

  const openNewEventAt = useCallback(
    (date: Date, startTime?: string, endTime?: string): void => {
      setNewEvent({
        title: '',
        date: date.toDateString(),
        startTime: startTime || '09:00',
        endTime: endTime || '10:00',
        color: '#2563eb',
        isRepeating: false,
        repeatDays: [],
        repeatFrequency: 'weekly',
      });
      setEditingEventId(null);
      setShowEventModal(true);
    },
    [],
  );

  const startEditing = useCallback((event: CalendarEvent): void => {
    setNewEvent({
      ...event,
      repeatDays: event.repeatDays || [],
      repeatFrequency: event.repeatFrequency || 'weekly',
    });
    setEditingEventId(event.id.toString());
    setShowEventModal(true);
  }, []);

  return {
    events,
    isLoading,
    error,
    loadEvents: async () => {
      // Events are loaded automatically via RxDB subscription
    },
    createOrUpdateEvent,
    deleteEvent,
    showEventModal,
    setShowEventModal,
    newEvent,
    setNewEvent,
    editingEventId,
    setEditingEventId,
    validateTime,
    adjustEventTimes,
    openNewEventAt,
    startEditing,
  };
}
