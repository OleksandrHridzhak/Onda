import { useState, useEffect, useRef } from "react";
import { CalendarEntry } from "features/calendar/types/types";
import { getColorStyle } from "shared/lib/color";
import { getMonday, getWeekDates, getWeekNumber } from "shared/lib/date";
import {
  timeToMinutes,
  calculateEventDurationMinutes,
  formatHour,
} from "../utils/time";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function useCalendarLayout(events: CalendarEntry[] = []) {
  const [viewMode, setViewMode] = useState<"week" | "day">(() => {
    const v = localStorage.getItem("calendarViewMode");
    return (v as "week" | "day") || "week";
  });

  useEffect(() => {
    localStorage.setItem("calendarViewMode", viewMode);
  }, [viewMode]);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>(
    getWeekDates(getMonday(new Date())),
  );

  useEffect(() => {
    setWeekDays(getWeekDates(currentWeekStart));
  }, [currentWeekStart]);

  const [slotHeight, setSlotHeight] = useState<number>(() => {
    if (typeof window === "undefined") return 80;
    return window.innerWidth < 640 ? 60 : 80;
  });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setSlotHeight(window.innerWidth < 640 ? 60 : 80);
    window.addEventListener("resize", update);
    // Run once to ensure initial value
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = formatHour;

  const goToPrevious = (): void => {
    if (viewMode === "week") {
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
    if (viewMode === "week") {
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

  const getEventsForDay = (day: Date): CalendarEntry[] => {
    const dayEvents: CalendarEntry[] = [];
    const currentWeekNumber = getWeekNumber(currentWeekStart);
    const eventWeekNumber = (event: CalendarEntry): number =>
      getWeekNumber(new Date(event.date));

    events.forEach((event) => {
      const dayIndex = day.getDay();

      if (!event.isRepeating) {
        if (event.date === day.toDateString()) {
          dayEvents.push(event);
        }
      } else {
        const isCorrectDay = event.repeatDays?.includes(dayIndex) ?? false;
        const isCorrectWeek =
          event.repeatFrequency === "weekly" ||
          (event.repeatFrequency === "biweekly" &&
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

  const getEventStyle = (event: CalendarEntry): React.CSSProperties => {
    const startMinutes = timeToMinutes(event.startTime);
    const duration = calculateEventDurationMinutes(
      event.startTime,
      event.endTime,
    );
    const top = (startMinutes / 60) * slotHeight;
    const height = (duration / 60) * slotHeight - 4;
    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: `var(${getColorStyle(event.color).cssVar})`,
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
    hours: HOURS,
    slotHeight,
    dayNames: DAY_NAMES,
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
