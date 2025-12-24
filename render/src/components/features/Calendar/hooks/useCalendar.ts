import { useState, useEffect } from 'react';
import { calendarService } from '../../../../services/calendarDB';

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: string; // stored as a date string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: string; // 'weekly' | 'biweekly'
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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

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

  useEffect(() => {
    const load = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await calendarService.getCalendar();
        if (response.status === 'success') {
          setEvents(response.data || []);
        } else {
          setError(response.error || 'Failed to load calendar');
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const createOrUpdateEvent = async (
    payload: NewEvent & { id?: string | number },
  ): Promise<CalendarEvent | null> => {
    try {
      const eventData: CalendarEvent = {
        id: payload.id || Date.now().toString(),
        title: payload.title,
        date: payload.date || new Date().toDateString(),
        startTime: payload.startTime,
        endTime: payload.endTime,
        color: payload.color,
        isRepeating: !!payload.isRepeating,
        repeatDays: payload.repeatDays || [],
        repeatFrequency: payload.repeatFrequency || 'weekly',
      };

      const response = await calendarService.updateCalendarEvent(eventData);
      if (response.status === 'success') {
        setEvents((prev) =>
          prev.some((e) => e.id === eventData.id)
            ? prev.map((e) => (e.id === eventData.id ? eventData : e))
            : [...prev, eventData],
        );
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
        return eventData;
      } else {
        setError(response.error || 'Failed to save event');
        return null;
      }
    } catch (e) {
      setError(e);
      return null;
    }
  };

  const deleteEvent = async (eventId: string | number): Promise<boolean> => {
    try {
      const response = await calendarService.deleteCalendarEvent(eventId);
      if (response.status === 'success') {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
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
      } else {
        setError(response.error || 'Failed to delete event');
        return false;
      }
    } catch (e) {
      setError(e);
      return false;
    }
  };

  const validateTime = (time: string): boolean => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  const adjustEventTimes = (delta: number): void => {
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
  };

  const openNewEventAt = (
    date: Date,
    startTime?: string,
    endTime?: string,
  ): void => {
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
  };

  const startEditing = (event: CalendarEvent): void => {
    setNewEvent({
      ...event,
      repeatDays: event.repeatDays || [],
      repeatFrequency: event.repeatFrequency || 'weekly',
    });
    setEditingEventId(event.id.toString());
    setShowEventModal(true);
  };

  return {
    events,
    isLoading,
    error,
    loadEvents: async () => {
      setIsLoading(true);
      try {
        const response = await calendarService.getCalendar();
        if (response.status === 'success') {
          setEvents(response.data || []);
        } else {
          setError(response.error || 'Failed to load calendar');
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
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
