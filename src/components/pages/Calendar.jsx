import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Trash2,ChevronDown } from 'lucide-react';
import { BubbleBtn } from '../atoms/BubbleBtn';

export default function Calendar({ darkTheme, setDarkTheme }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
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
  const [filterColor, setFilterColor] = useState(null);

  const gridRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const slotHeight = 80;
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Color mapping object
  const colorMap = {
    '#2563eb': 'Blue',
    '#059669': 'Green',
    '#7c3aed': 'Purple',
    '#dc2626': 'Red',
    '#d97706': 'Orange',
  };

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
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return Math.round(((d - week1) / 86400000 + 1) / 7);
  };

  // Load events from backend
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await window.electronAPI.calendarGetEvents();
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
    const interval = setInterval(async () => {
      try {
        const response = await window.electronAPI.calendarGetTime();
        if (response.status === 'success') {
          setCurrentTime(new Date(response.time));
        }
      } catch (error) {
        console.error('Error fetching time:', error);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update week days
  useEffect(() => {
    setWeekDays(getWeekDays(currentWeekStart));
  }, [currentWeekStart]);

  // Auto-scroll to current time
  useEffect(() => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const scrollPosition = (minutes / 60) * slotHeight - gridRef.current.clientHeight / 2 + slotHeight / 2;
    gridRef.current.scrollTo({ top: Math.max(0, scrollPosition) });
  }, []);

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
    if (!newEvent.title.trim() || !validateTime(newEvent.startTime) || !validateTime(newEvent.endTime)) return;
    try {
      const eventData = {
        id: editingEventId || Date.now().toString(),
        ...newEvent,
      };
      const response = await window.electronAPI.calendarSaveEvent(eventData);
      if (response.status === 'success') {
        setEvents((prev) =>
          editingEventId
            ? prev.map((e) => (e.id === editingEventId ? eventData : e))
            : [...prev, eventData]
        );
        setShowEventModal(false);
        setNewEvent({ title: '', startTime: '09:00', endTime: '10:00', color: '#2563eb', isRepeating: false, repeatDays: [], repeatFrequency: 'weekly' });
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
    setNewEvent({ ...event, repeatDays: event.repeatDays || [], repeatFrequency: event.repeatFrequency || 'weekly' });
    setEditingEventId(event.id);
    setShowEventModal(true);
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await window.electronAPI.calendarDeleteEvent(eventId);
      if (response.status === 'success') {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        setShowEventModal(false);
        setNewEvent({ title: '', startTime: '09:00', endTime: '10:00', color: '#2563eb', isRepeating: false, repeatDays: [], repeatFrequency: 'weekly' });
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
            (currentWeekNumber % 2 === eventWeekNumber(event) % 2));

        if (isCorrectDay && isCorrectWeek) {
          dayEvents.push({
            ...event,
            date: day.toDateString(),
          });
        }
      }
    });

    return dayEvents.filter((event) => !filterColor || event.color === filterColor);
  };

  // Helper to adjust start/end time by delta minutes
  const adjustEventTime = (field, delta) => {
    const [h, m] = newEvent[field].split(':').map(Number);
    let total = h * 60 + m + delta;
    if (total < 0) total += 24 * 60;
    if (total >= 24 * 60) total -= 24 * 60;
    const nh = Math.floor(total / 60).toString().padStart(2, '0');
    const nm = (total % 60).toString().padStart(2, '0');
    setNewEvent({ ...newEvent, [field]: `${nh}:${nm}` });
  };

  // Helper to shift both start and end times by delta minutes
  const adjustEventTimes = (delta) => {
    const shift = (time) => {
      const [h, m] = time.split(':').map(Number);
      let total = h * 60 + m + delta;
      if (total < 0) total += 24 * 60;
      if (total >= 24 * 60) total -= 24 * 60;
      const nh = Math.floor(total / 60).toString().padStart(2, '0');
      const nm = (total % 60).toString().padStart(2, '0');
      return nh + ':' + nm;
    };
    setNewEvent({ ...newEvent, startTime: shift(newEvent.startTime), endTime: shift(newEvent.endTime) });
  };

  // Get days to display based on view mode
  const getDisplayDays = () => {
    return viewMode === 'day' ? [selectedDate] : weekDays;
  };

  return (
    <div className={`font-poppins min-h-screen ${darkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: ${darkTheme ? 'rgba(55, 65, 81, 0.3)' : 'rgba(241, 241, 241, 0.3)'};
          border-radius: 5px;
          margin: 4px 0;
          transition: background 0.2s ease;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${darkTheme ? 'rgba(156, 163, 175, 0.8)' : 'rgba(156, 163, 175, 0.6)'};
          border-radius: 5px;
          border: 2px solid ${darkTheme ? 'rgba(55, 65, 81, 0.3)' : 'rgba(241, 241, 241, 0.3)'};
          transition: background 0.2s ease, border 0.2s ease;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${darkTheme ? 'rgba(107, 114, 128, 1)' : 'rgba(107, 114, 128, 0.8)'};
        }
        .custom-scroll::-webkit-scrollbar-thumb:active {
          background: ${darkTheme ? 'rgba(75, 85, 99, 1)' : 'rgba(75, 85, 99, 0.9)'};
        }
        .custom-scroll {
          scrollbar-color: ${
            darkTheme
              ? 'rgba(156, 163, 175, 0.8) rgba(55, 65, 81, 0.3)'
              : 'rgba(156, 163, 175, 0.6) rgba(241, 241, 241, 0.3)'
          };
          scrollbar-width: thin;
        }
        .custom-checkbox {
          position: relative;
          width: 18px;
          height: 18px;
          appearance: none;
          background: ${darkTheme ? 'rgba(55, 65, 81, 1)' : 'rgba(255, 255, 255, 1)'};
          border: 2px solid ${darkTheme ? 'rgba(156, 163, 175, 0.8)' : 'rgba(156, 163, 175, 0.6)'};
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .custom-checkbox:checked {
          background: ${darkTheme ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)'};
          border-color: ${darkTheme ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)'};
        }
        .custom-checkbox:checked::after {
          content: '✔';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: ${darkTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)'};
          font-size: 12px;
        }
        .custom-checkbox:hover {
          border-color: ${darkTheme ? 'rgba(107, 114, 128, 1)' : 'rgba(107, 114, 128, 0.8)'};
        }
        .custom-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${darkTheme ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
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

      {/* Header */}
      <div className={`sticky top-0 z-20 ${darkTheme ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700' : 'bg-white/95 backdrop-blur-sm border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl ${darkTheme ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
              <CalendarIcon size={22} className={darkTheme ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <div className="flex flex-col">
              <h2 className={`text-xl font-semibold tracking-tight ${darkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
                {viewMode === 'day'
                  ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : weekDays[0]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <p className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                {viewMode === 'day' ? dayNames[selectedDate.getDay()] : `Week ${getWeekNumber(currentWeekStart)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center gap-1 p-1 ${darkTheme ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-xl`}>
              <button
                onClick={goToPrevious}
                className={`p-2 ${darkTheme ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' : 'text-blue-600 hover:text-blue-800 hover:bg-gray-200'} rounded-lg transition-colors`}
                aria-label={viewMode === 'day' ? 'Previous day' : 'Previous week'}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goToCurrent}
                className={`px-3 py-1.5 text-sm ${darkTheme ? 'text-gray-300 bg-gray-600/50 hover:bg-gray-500' : 'text-gray-700 bg-white hover:bg-gray-50'} rounded-lg transition-colors`}
              >
                Today
              </button>
              <button
                onClick={goToNext}
                className={`p-2 ${darkTheme ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' : 'text-blue-600 hover:text-blue-800 hover:bg-gray-200'} rounded-lg transition-colors`}
                aria-label={viewMode === 'day' ? 'Next day' : 'Next week'}
              >
                <ChevronRight size={18} />
              </button>
            </div>
              <div className="relative ">
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className={`appearance-none w-32   px-3 pr-10 py-1.5 text-sm ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border`}
                >
                  <option value="week">Week View</option>
                  <option value="day">Day View</option>
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            <div className="relative">
              <select
                value={filterColor || ''}
                onChange={(e) => setFilterColor(e.target.value || null)}
                className={`appearance-none w-32  px-3 pr-10 py-1.5 text-sm ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border`}
              >
                <option value="">All Events</option>
                {Object.entries(colorMap).map(([hex, name]) => (
                  <option key={hex} value={hex}>
                    {name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-3  top-1/2 -translate-y-1/2 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
            <button
              onClick={() => {
                setNewEvent({ title: '', startTime: '09:00', endTime: '10:00', color: '#2563eb', isRepeating: false, repeatDays: [], repeatFrequency: 'weekly' });
                setEditingEventId(null);
                setShowEventModal(true);
              }}
              className={`px-4 py-1.5 text-sm text-white ${darkTheme ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl flex items-center gap-2 transition-colors shadow-sm hover:shadow-md`}
            >
              <Plus size={16} />
              New Event
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto p-2 sm:px-3 pb-8 sm:pb-12">
        <div className={`rounded-2xl overflow-auto ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border custom-scroll`}>
          <div className="relative overflow-y-auto max-h-[620px]" ref={gridRef}>
            <div className="flex">
              {/* Hour labels */}
              <div className={`w-20 flex-shrink-0 sticky left-0 ${darkTheme ? 'bg-gray-800' : 'bg-white'} z-10`}>
                <div className="h-16" />
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`h-[80px] flex items-start justify-end pr-3 text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'} -translate-y-2.5`}
                  >
                    {formatTime(hour)}
                  </div>
                ))}
              </div>

              {/* Days and events */}
              <div className="flex-1 flex min-w-[120px]">
                {getDisplayDays().map((day, dayIndex) => (
                  <div key={day.toDateString()} className={`flex-1 ${darkTheme ? 'border-gray-700' : 'border-gray-200'} border-l relative`}>
                    <div className={`sticky top-0 ${darkTheme ? 'bg-gray-800' : 'bg-white'} z-40 py-3 text-center ${darkTheme ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <div className={`text-xs ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{dayNames[day.getDay()]}</div>
                      <div
                        className={`mt-1 text-sm font-medium ${
                          day.toDateString() === new Date().toDateString()
                            ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto'
                            : darkTheme
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        } rounded-full w-6 h-6 flex items-center justify-center mx-auto`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                    <div className="relative" style={{ height: `${slotHeight * 24}px` }}>
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className={`absolute w-full ${darkTheme ? 'border-gray-700' : 'border-gray-200'} border-t ${darkTheme ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} cursor-pointer z-10`}
                          style={{ top: `${hour * slotHeight}px`, height: `${slotHeight}px` }}
                          onClick={() => handleTimeSlotClick(dayIndex, hour)}
                        />
                      ))}
                      {getEventsForDay(day).map((event) => {
                        const startMinutes = timeToMinutes(event.startTime);
                        let endMinutes = timeToMinutes(event.endTime);
                        if (endMinutes <= startMinutes) {
                          endMinutes += 24 * 60;
                        }
                        const duration = endMinutes - startMinutes;
                        const isShortEvent = duration <= 30;
                        return (
                          <div
                            key={`${event.id}-${event.date}`}
                            className={`absolute z-30 left-2 right-2 rounded-xl p-2 text-white text-xs shadow-md cursor-pointer ${isShortEvent ? 'short-event' : ''} ${darkTheme ? 'shadow-gray-900' : ''}`}
                            style={getEventStyle(event)}
                            onClick={() => handleEditEvent(event)}
                            title={`${event.title} (${event.startTime} - ${event.endTime})`}
                          >
                            <div className="flex text-ellipsis overflow-hidden justify-between items-start">
                              <div>
                                <div className="event-title font-medium ">{event.title}</div>
                                <div className="event-time truncate">{event.startTime} - {event.endTime}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {day.toDateString() === currentTime.toDateString() && (
                        <div
                          className="absolute left-0 right-0 h-[2px] bg-red-500 z-30"
                          style={{ top: `${getCurrentTimePosition()}px` }}
                        >
                          <div className="w-3 h-3 bg-red-500 rounded-full -translate-y-1" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl border ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{editingEventId ? 'Edit Event' : 'New Event'}</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className={`w-full border ${darkTheme ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  placeholder="Event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Start</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className={`w-full border ${darkTheme ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${!validateTime(newEvent.startTime) && newEvent.startTime ? 'border-red-500' : ''}`}
                      placeholder="HH:mm"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>End</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className={`w-full border ${darkTheme ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${!validateTime(newEvent.endTime) && newEvent.endTime ? 'border-red-500' : ''}`}
                      placeholder="HH:mm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                <BubbleBtn onClick={() => adjustEventTimes(-5)} darkTheme={darkTheme}>
                  -5m
                </BubbleBtn>
                <BubbleBtn onClick={() => adjustEventTimes(5)} darkTheme={darkTheme}>
                  +5m
                </BubbleBtn>
              </div>
              <div>
                <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Color</label>
                <div className="flex gap-3">
                  {Object.entries(colorMap).map(([hex, name]) => (
                    <div
                      key={hex}
                      className={`w-6 h-6 rounded-full cursor-pointer ${
                        newEvent.color === hex ? 'ring-2 ring-offset-2 ring-gray-300' : ''
                      }`}
                      style={{ backgroundColor: hex }}
                      onClick={() => setNewEvent({ ...newEvent, color: hex })}
                      title={name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className={`flex items-center gap-2 text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  <input
                    type="checkbox"
                    checked={newEvent.isRepeating}
                    onChange={(e) => setNewEvent({ ...newEvent, isRepeating: e.target.checked, repeatDays: [] })}
                    className="custom-checkbox"
                  />
                  Repeat Event
                </label>
                {newEvent.isRepeating && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Repeat on</label>
                      <div className="flex gap-2 flex-wrap">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <label key={day} className={`flex items-center gap-1 text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            <input
                              type="checkbox"
                              checked={newEvent.repeatDays.includes((index + 1) % 7)}
                              onChange={(e) => {
                                const dayIndex = (index + 1) % 7;
                                setNewEvent({
                                  ...newEvent,
                                  repeatDays: e.target.checked
                                    ? [...newEvent.repeatDays, dayIndex].sort()
                                    : newEvent.repeatDays.filter((d) => d !== dayIndex),
                                });
                              }}
                              className="custom-checkbox"
                            />
                            {day}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Frequency</label>
                      <select
                        value={newEvent.repeatFrequency}
                        onChange={(e) => setNewEvent({ ...newEvent, repeatFrequency: e.target.value })}
                        className={`w-full border ${darkTheme ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300`}
                      >
                        <option value="weekly">Every Week</option>
                        <option value="biweekly">Every Other Week</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              {editingEventId && (
                <button
                  onClick={() => handleDeleteEvent(editingEventId)}
                  className={`px-4 py-2 text-sm ${darkTheme ? 'text-red-400 bg-gray-700 hover:bg-gray-600' : 'text-red-600 bg-gray-100 hover:bg-gray-200'} rounded-xl transition-colors flex items-center gap-1`}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              <button
                onClick={() => setShowEventModal(false)}
                className={`px-4 py-2 text-sm ${darkTheme ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'} rounded-xl transition-colors`}
              >
                Cancel
              </button>
              <BubbleBtn 
                onClick={handleSaveEvent} 
                darkTheme={darkTheme}
                disabled={!validateTime(newEvent.startTime) || !validateTime(newEvent.endTime)}
              >
                {editingEventId ? 'Update' : 'Create'}
              </BubbleBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}