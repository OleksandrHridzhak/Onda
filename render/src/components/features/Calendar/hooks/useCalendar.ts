import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
    getAllCalendarEvents,
    saveCalendarEvent,
    deleteCalendarEvent,
} from '../../../../db/helpers/calendar';
import { CalendarEntry } from '../../../../types/calendar.types';

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
    // Use liveQuery to reactively fetch all calendar events from Dexie DB
    const liveEvents = useLiveQuery(async () => {
        const result = await getAllCalendarEvents();
        if (result.success && result.data) {
            return result.data;
        }
        return [];
    }, []);

    // Events are now reactive - no need for manual state management
    const events: CalendarEntry[] = liveEvents ?? [];
    const isLoading = liveEvents === undefined;

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

    const createOrUpdateEvent = async (
        payload: NewEvent & { id?: string | number },
    ): Promise<CalendarEntry | null> => {
        try {
            const eventData: CalendarEntry = {
                id: payload.id?.toString() || Date.now().toString(),
                title: payload.title,
                date: payload.date || new Date().toDateString(),
                startTime: payload.startTime,
                endTime: payload.endTime,
                color: payload.color,
                isRepeating: !!payload.isRepeating,
                repeatDays: payload.repeatDays || [],
                repeatFrequency:
                    (payload.repeatFrequency as CalendarEntry['repeatFrequency']) ||
                    'weekly',
            };

            const response = await saveCalendarEvent(eventData);
            if (response.success) {
                // No need to manually update state - liveQuery will automatically update
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

    const deleteEventFn = async (
        eventId: string | number,
    ): Promise<boolean> => {
        try {
            const response = await deleteCalendarEvent(eventId.toString());
            if (response.success) {
                // No need to manually update state - liveQuery will automatically update
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

    const startEditing = (event: CalendarEntry): void => {
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
        // loadEvents is now handled automatically by liveQuery - no manual refresh needed
        loadEvents: async () => {
            // No-op: liveQuery handles reactive updates automatically
        },
        createOrUpdateEvent,
        deleteEvent: deleteEventFn,
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
