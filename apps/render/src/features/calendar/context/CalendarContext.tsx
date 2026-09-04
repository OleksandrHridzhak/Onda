import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { CalendarEntry, CalendarViewMode, EventFormData } from "../types";
import { useCalendarEvents } from "shared/api/db";
import {
  saveCalendarEvent,
  deleteCalendarEvent,
} from "features/calendar/api/calendar";
import {
  getMonday,
  getWeekDates,
  getWeekNumber,
  formatDateKey,
  parseDateKey,
} from "shared/lib/date";
import { getColorStyle } from "shared/lib/color";
import {
  timeToMinutes,
  calculateEventDurationMinutes,
  formatHour,
} from "../utils/time";

interface CalendarContextValue {
  // Navigation & View
  viewMode: CalendarViewMode;
  setViewMode: (mode: CalendarViewMode) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentWeekStart: Date;
  weekDays: Date[];
  displayDays: Date[];
  goToPrevious: () => void;
  goToNext: () => void;
  goToCurrent: () => void;

  // Layout & Scroll
  slotHeight: number;
  gridRef: React.RefObject<HTMLDivElement | null>;
  currentTime: Date;
  scrollToCurrentTime: (behavior?: ScrollBehavior) => void;
  getCurrentTimePosition: () => number;
  getEventStyle: (event: CalendarEntry) => React.CSSProperties;

  // Events & Filtering
  events: CalendarEntry[];
  getEventsForDay: (day: Date) => CalendarEntry[];

  // Modal State
  isModalOpen: boolean;
  modalEvent: CalendarEntry | null;
  initialSlot: { date: string; startTime: string; endTime: string } | null;
  openCreateModal: (date: Date, startTime?: string, endTime?: string) => void;
  openEditModal: (event: CalendarEntry) => void;
  closeModal: () => void;

  // CRUD Operations
  saveEvent: (data: EventFormData) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  // 1. View Mode (persisted)
  const [viewMode, setViewModeState] = useState<CalendarViewMode>(() => {
    if (typeof window === "undefined") return "week";
    const saved = localStorage.getItem("calendarViewMode");
    return saved === "day" || saved === "week" ? saved : "week";
  });

  const setViewMode = useCallback((mode: CalendarViewMode) => {
    setViewModeState(mode);
    localStorage.setItem("calendarViewMode", mode);
  }, []);

  // 2. Dates & Navigation
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getMonday(new Date()),
  );

  const weekDays = useMemo(
    () => getWeekDates(currentWeekStart),
    [currentWeekStart],
  );

  const displayDays = useMemo(() => {
    return viewMode === "day" ? [selectedDate] : weekDays;
  }, [viewMode, selectedDate, weekDays]);

  // 3. Grid sizing & Responsive slot height
  const [slotHeight, setSlotHeight] = useState<number>(() => {
    if (typeof window === "undefined") return 80;
    return window.innerWidth < 640 ? 60 : 80;
  });
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setSlotHeight(window.innerWidth < 640 ? 60 : 80);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 4. Current Time ticker (for live indicator line ONLY, does NOT cause auto-scroll)
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 5. Scroll to now logic (called only on initial mount or when user clicks 'Today')
  const scrollToCurrentTime = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      if (!gridRef.current) return;
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const scrollPosition =
        (minutes / 60) * slotHeight -
        (gridRef.current.clientHeight || 0) / 2 +
        slotHeight / 2;

      gridRef.current.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior,
      });
    },
    [slotHeight],
  );

  // Initial scroll on mount - ONCE only!
  const hasScrolledInitialRef = useRef(false);
  useEffect(() => {
    if (!hasScrolledInitialRef.current && gridRef.current) {
      hasScrolledInitialRef.current = true;
      // Slight timeout to ensure layout has painted
      const timer = setTimeout(() => {
        scrollToCurrentTime("auto");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [scrollToCurrentTime]);

  const goToPrevious = useCallback(() => {
    if (viewMode === "week") {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        return d;
      });
      setSelectedDate((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        return d;
      });
    } else {
      setSelectedDate((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 1);
        setCurrentWeekStart(getMonday(d));
        return d;
      });
    }
  }, [viewMode]);

  const goToNext = useCallback(() => {
    if (viewMode === "week") {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 7);
        return d;
      });
      setSelectedDate((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 7);
        return d;
      });
    } else {
      setSelectedDate((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 1);
        setCurrentWeekStart(getMonday(d));
        return d;
      });
    }
  }, [viewMode]);

  const goToCurrent = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentWeekStart(getMonday(today));
    scrollToCurrentTime("smooth");
  }, [scrollToCurrentTime]);

  // 6. Events from Reactive DB
  const liveEvents = useCalendarEvents();
  const events = useMemo(() => liveEvents ?? [], [liveEvents]);

  const getEventsForDay = useCallback(
    (day: Date): CalendarEntry[] => {
      const dayKey = formatDateKey(day);
      const dayIndex = day.getDay();
      const currentWeekNumber = getWeekNumber(currentWeekStart);

      const dayEvents: CalendarEntry[] = [];

      for (const event of events) {
        if (!event.isRepeating) {
          if (event.date === dayKey) {
            dayEvents.push(event);
          }
        } else {
          const isCorrectDay = event.repeatDays?.includes(dayIndex) ?? false;
          if (!isCorrectDay) continue;

          let isCorrectWeek = true;
          if (event.repeatFrequency === "biweekly") {
            const eventDate = parseDateKey(event.date);
            const eventWeekNumber = getWeekNumber(eventDate);
            isCorrectWeek = currentWeekNumber % 2 === eventWeekNumber % 2;
          }

          if (isCorrectWeek) {
            dayEvents.push({
              ...event,
              date: dayKey,
            });
          }
        }
      }

      return dayEvents;
    },
    [events, currentWeekStart],
  );

  const getEventStyle = useCallback(
    (event: CalendarEntry): React.CSSProperties => {
      const startMinutes = timeToMinutes(event.startTime);
      const duration = calculateEventDurationMinutes(
        event.startTime,
        event.endTime,
      );
      const top = (startMinutes / 60) * slotHeight;
      const height = Math.max((duration / 60) * slotHeight - 4, 20);
      const colorToken = getColorStyle(event.color);

      return {
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: `var(${colorToken.cssVar})`,
      };
    },
    [slotHeight],
  );

  const getCurrentTimePosition = useCallback((): number => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (minutes / 60) * slotHeight;
  }, [currentTime, slotHeight]);

  // 7. Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<CalendarEntry | null>(null);
  const [initialSlot, setInitialSlot] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const openCreateModal = useCallback(
    (date: Date, startTime?: string, endTime?: string) => {
      const dateKey = formatDateKey(date);
      const start = startTime || "09:00";
      const end =
        endTime ||
        (startTime
          ? formatHour((parseInt(startTime.split(":")[0], 10) + 1) % 24)
          : "10:00");

      setModalEvent(null);
      setInitialSlot({ date: dateKey, startTime: start, endTime: end });
      setIsModalOpen(true);
    },
    [],
  );

  const openEditModal = useCallback((event: CalendarEntry) => {
    setModalEvent(event);
    setInitialSlot(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalEvent(null);
    setInitialSlot(null);
  }, []);

  // 8. CRUD Actions
  const saveEvent = useCallback(
    async (data: EventFormData): Promise<boolean> => {
      try {
        const payload = {
          ...(data.id ? { id: data.id } : {}),
          title: data.title,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          color: data.color,
          isRepeating: Boolean(data.isRepeating),
          repeatDays: data.repeatDays,
          repeatFrequency: data.repeatFrequency,
        };
        const res = await saveCalendarEvent(payload);
        if (res.success) {
          closeModal();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [closeModal],
  );

  const deleteEvent = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await deleteCalendarEvent(id);
        if (res.success) {
          closeModal();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [closeModal],
  );

  const value: CalendarContextValue = {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    currentWeekStart,
    weekDays,
    displayDays,
    goToPrevious,
    goToNext,
    goToCurrent,
    slotHeight,
    gridRef,
    currentTime,
    scrollToCurrentTime,
    getCurrentTimePosition,
    getEventStyle,
    events,
    getEventsForDay,
    isModalOpen,
    modalEvent,
    initialSlot,
    openCreateModal,
    openEditModal,
    closeModal,
    saveEvent,
    deleteEvent,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider",
    );
  }
  return ctx;
}
