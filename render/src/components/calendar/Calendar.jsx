import { useState, useEffect, useRef } from 'react';
import EventModal from './EventModal';
import CalendarHeader from './CalendarHeader';
import CalendarTimeline from './CalendarTimeline';
import { useSelector } from 'react-redux';
import { settingsService } from '../../services/settingsDB';
import { calendarService } from '../../services/calendarDB';

export default function Calendar() {
  const { mode } = useSelector((state) => state.theme);
  const darkTheme = mode === 'dark';
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getMonday(new Date())
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('calendarViewMode') || 'week';
  });
  const [weekDays, setWeekDays] = useState(getWeekDays(getMonday(new Date())));
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    color: '#2563eb',
    isRepeating: false,
    repeatDays: [],
    repeatFrequency: 'weekly',
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterColor] = useState(null);

  const gridRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const slotHeight = 80;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calendarViewMode', viewMode);
  }, [viewMode]);

  // Helper functions
  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate) {
    const days = [];
    const date = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  const formatTime = (hour) => `${hour.toString().padStart(2, '0')}:00`;
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateTime = (time) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return Math.round(((d - week1) / 86400000 + 1) / 7);
  };

  // Load events from backend
  useEffect(() => {
    const loadEvents = async () => {
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

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);


  // Update week days
  useEffect(() => {
    setWeekDays(getWeekDays(currentWeekStart));
  }, [currentWeekStart]);

  // Navigation
  const goToPrevious = () => {
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

  const goToNext = () => {
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

  const goToCurrent = () => {
    const today = new Date();
    setCurrentWeekStart(getMonday(today));
    setSelectedDate(today);
  };

  // Handle time slot click
  const handleTimeSlotClick = (dayIndex, hour) => {
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

  // Create or update event
  const handleSaveEvent = async () => {
    if (
      !newEvent.title.trim() ||
      !validateTime(newEvent.startTime) ||
      !validateTime(newEvent.endTime)
    )
      return;
    try {
      const eventData = {
        id: editingEventId || Date.now().toString(),
        ...newEvent,
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

  // Edit event
  const handleEditEvent = (event) => {
    setNewEvent({
      ...event,
      repeatDays: event.repeatDays || [],
      repeatFrequency: event.repeatFrequency || 'weekly',
    });
    setEditingEventId(event.id);
    setShowEventModal(true);
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
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

  // Event styling
  const getEventStyle = (event) => {
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

  // Current time indicator position
  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (minutes / 60) * slotHeight;
  };

  // Get events for a specific day, including repeating events
  const getEventsForDay = (day) => {
    const dayEvents = [];
    const currentWeekNumber = getWeekNumber(currentWeekStart);
    const eventWeekNumber = (event) => getWeekNumber(new Date(event.date));

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const dayIndex = day.getDay(); // Sun=0, Mon=1, ..., Sat=6

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

  // Helper to shift both start and end times by delta minutes
  const adjustEventTimes = (delta) => {
    const shift = (time) => {
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
          background: ${darkTheme
            ? 'rgba(55, 65, 81, 1)'
            : 'rgba(255, 255, 255, 1)'};
          border: 2px solid
            ${darkTheme
              ? 'rgba(156, 163, 175, 0.8)'
              : 'rgba(156, 163, 175, 0.6)'};
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .custom-checkbox:checked {
          background: ${darkTheme
            ? 'rgba(59, 130, 246, 1)'
            : 'rgba(37, 99, 235, 1)'};
          border-color: ${darkTheme
            ? 'rgba(59, 130, 246, 1)'
            : 'rgba(37, 99, 235, 1)'};
        }
        .custom-checkbox:checked::after {
          content: '✔';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: ${darkTheme
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(255, 255, 255, 1)'};
          font-size: 12px;
        }
        .custom-checkbox:hover {
          border-color: ${darkTheme
            ? 'rgba(107, 114, 128, 1)'
            : 'rgba(107, 114, 128, 0.8)'};
        }
        .custom-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px
            ${darkTheme ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
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
