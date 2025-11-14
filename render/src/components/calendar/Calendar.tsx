import React, { useState, useEffect, useRef } from 'react';
import EventModal from './EventModal';
import CalendarHeader from './CalendarHeader';
import CalendarTimeline from './CalendarTimeline';
import { calendarService } from '../../services/calendarDB';

interface CalendarEvent {
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

interface NewEvent {
  title: string;
  date?: string;
  startTime: string;
  endTime: string;
  color: string;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: string;
}

export default function Calendar(): React.ReactElement {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date())
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<string>(() => {
    return localStorage.getItem('calendarViewMode') || 'week';
  });
  const [weekDays, setWeekDays] = useState<Date[]>(getWeekDays(getMonday(new Date())));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
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
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [filterColor] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const slotHeight = 80;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    localStorage.setItem('calendarViewMode', viewMode);
  }, [viewMode]);

  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    const date = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  const formatTime = (hour: number): string => `${hour.toString().padStart(2, '0')}:00`;
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateTime = (time: string): boolean => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return Math.round(((d.getTime() - week1.getTime()) / 86400000 + 1) / 7);
  };

  useEffect(() => {
    const loadEvents = async (): Promise<void> => {
      try {
        const response = await calendarService.getCalendar();
        if (response.status === 'success') {
          setEvents(response.data);
        } else {
          console.error('Error loading events:', response.error);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setWeekDays(getWeekDays(currentWeekStart));
  }, [currentWeekStart]);

  const goToPrevious = (): void => {
    if (viewMode === 'week') {
      const prevMonday = new Date(currentWeekStart);
      prevMonday.setDate(prevMonday.getDate() - 7);
      setCurrentWeekStart(prevMonday);
      setSelectedDate(new Date(prevMonday));
    } else {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setSelectedDate(prevDay);
      setCurrentWeekStart(getMonday(prevDay));
    }
  };

  const goToNext = (): void => {
    if (viewMode === 'week') {
      const nextMonday = new Date(currentWeekStart);
      nextMonday.setDate(nextMonday.getDate() + 7);
      setCurrentWeekStart(nextMonday);
      setSelectedDate(new Date(nextMonday));
    } else {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
      setCurrentWeekStart(getMonday(nextDay));
    }
  };

  const goToCurrent = (): void => {
    const today = new Date();
    setCurrentWeekStart(getMonday(today));
    setSelectedDate(today);
  };

  const handleTimeSlotClick = (dayIndex: number, hour: number): void => {
    const startTime = formatTime(hour);
    const endTime = formatTime((hour + 1) % 24);
    const selectedDay = viewMode === 'day' ? selectedDate : weekDays[dayIndex];
    setNewEvent({
      title: '',
      date: selectedDay.toDateString(),
      startTime,
      endTime,
      color: '#2563eb',
      isRepeating: false,
      repeatDays: [],
      repeatFrequency: 'weekly',
    });
    setEditingEventId(null);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (): Promise<void> => {
    if (
      !newEvent.title.trim() ||
      !validateTime(newEvent.startTime) ||
      !validateTime(newEvent.endTime)
    )
      return;
    try {
      const eventData: CalendarEvent = {
        id: editingEventId || Date.now().toString(),
        ...newEvent,
        date: newEvent.date || new Date().toDateString(),
      };
      const response = await calendarService.updateCalendarEvent(eventData);
      if (response.status === 'success') {
        setEvents((prev) =>
          editingEventId
            ? prev.map((e) => (e.id === editingEventId ? eventData : e))
            : [...prev, eventData]
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
      } else {
        console.error('Error saving event:', response.error);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEditEvent = (event: CalendarEvent): void => {
    setNewEvent({
      ...event,
      repeatDays: event.repeatDays || [],
      repeatFrequency: event.repeatFrequency || 'weekly',
    });
    setEditingEventId(event.id.toString());
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId: string): Promise<void> => {
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
      } else {
        console.error('Error deleting event:', response.message);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getEventStyle = (event: CalendarEvent): React.CSSProperties => {
    const startMinutes = timeToMinutes(event.startTime);
    let endMinutes = timeToMinutes(event.endTime);
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }
    const duration = endMinutes - startMinutes;
    const top = (startMinutes / 60) * slotHeight;
    const height = (duration / 60) * slotHeight - 4;
    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: event.color,
    };
  };

  const getCurrentTimePosition = (): number => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (minutes / 60) * slotHeight;
  };

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const dayEvents: CalendarEvent[] = [];
    const currentWeekNumber = getWeekNumber(currentWeekStart);
    const eventWeekNumber = (event: CalendarEvent): number => getWeekNumber(new Date(event.date));

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const dayIndex = day.getDay();

      if (!event.isRepeating) {
        if (event.date === day.toDateString()) {
          dayEvents.push(event);
        }
      } else {
        const isCorrectDay = event.repeatDays.includes(dayIndex);
        const isCorrectWeek =
          event.repeatFrequency === 'weekly' ||
          (event.repeatFrequency === 'biweekly' &&
            currentWeekNumber % 2 === eventWeekNumber(event) % 2);

        if (isCorrectDay && isCorrectWeek) {
          dayEvents.push({
            ...event,
            date: day.toDateString(),
          });
        }
      }
    });

    return dayEvents.filter(
      (event) => !filterColor || event.color === filterColor
    );
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
    setNewEvent({
      ...newEvent,
      startTime: shift(newEvent.startTime),
      endTime: shift(newEvent.endTime),
    });
  };

  return (
    <div className={`font-poppins min-h-screen bg-tableHeader`}>
      <style jsx global>{`
        .custom-checkbox {
          position: relative;
          width: 18px;
          height: 18px;
          appearance: none;
          background: var(--background);
          border: 2px solid var(--border);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .custom-checkbox:checked {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }
        .custom-checkbox:checked::after {
          content: '✔';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--icon-active);
          font-size: 12px;
        }
        .custom-checkbox:hover {
          border-color: var(--text-table-values);
        }
        .custom-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--hover-bg);
        }
        .short-event .event-time {
          display: none;
        }
        .short-event .event-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedDate={selectedDate}
        weekDays={weekDays}
        currentWeekStart={currentWeekStart}
        getWeekNumber={getWeekNumber}
        goToPrevious={goToPrevious}
        goToCurrent={goToCurrent}
        goToNext={goToNext}
        setNewEvent={setNewEvent}
        setEditingEventId={setEditingEventId}
        setShowEventModal={setShowEventModal}
      />

      <CalendarTimeline
        viewMode={viewMode}
        selectedDate={selectedDate}
        weekDays={weekDays}
        currentTime={currentTime}
        hours={hours}
        slotHeight={slotHeight}
        dayNames={dayNames}
        gridRef={gridRef}
        formatTime={formatTime}
        timeToMinutes={timeToMinutes}
        getEventsForDay={getEventsForDay}
        getEventStyle={getEventStyle}
        getCurrentTimePosition={getCurrentTimePosition}
        handleTimeSlotClick={handleTimeSlotClick}
        handleEditEvent={handleEditEvent}
      />

      <EventModal
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        editingEventId={editingEventId}
        handleSaveEvent={handleSaveEvent}
        handleDeleteEvent={handleDeleteEvent}
        validateTime={validateTime}
        adjustEventTimes={adjustEventTimes}
      />
    </div>
  );
}
