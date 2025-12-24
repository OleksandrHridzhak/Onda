import { useState, useEffect, useRef } from 'react';
import type { CalendarEvent } from './useCalendar';

export function useCalendarLayout(events: CalendarEvent[] = []) {
  const [viewMode, setViewMode] = useState<'week' | 'day'>(() => {
    const v = localStorage.getItem('calendarViewMode');
    return (v as 'week' | 'day') || 'week';
  });

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

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>(
    getWeekDays(getMonday(new Date())),
  );

  useEffect(() => {
    setWeekDays(getWeekDays(currentWeekStart));
  }, [currentWeekStart]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const slotHeight = 80;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const gridRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (hour: number): string =>
    `${hour.toString().padStart(2, '0')}:00`;
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return Math.round(((d.getTime() - week1.getTime()) / 86400000 + 1) / 7);
  };

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

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const dayEvents: CalendarEvent[] = [];
    const currentWeekNumber = getWeekNumber(currentWeekStart);
    const eventWeekNumber = (event: CalendarEvent): number =>
      getWeekNumber(new Date(event.date));

    events.forEach((event) => {
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

    return dayEvents;
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

  return {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    currentWeekStart,
    weekDays,
    hours,
    slotHeight,
    dayNames,
    gridRef,
    currentTime,
    formatTime,
    timeToMinutes,
    getEventsForDay,
    getEventStyle,
    getCurrentTimePosition,
    getWeekNumber,
    goToPrevious,
    goToNext,
    goToCurrent,
  };
}
