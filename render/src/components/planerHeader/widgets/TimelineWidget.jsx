import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useSelector } from "react-redux";

const TimelineWidget = () => {
  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  console.log(useSelector((state) => state.theme));

  const darkTheme = useSelector((state) => state.theme.darkMode);


  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60 * 1000); // Оновлюємо кожну хвилину

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadTodayEvents = async () => {
      try {
        setLoading(true);
        const response = await window.electronAPI.calendarGetEvents();
        if (response.status === 'success') {
          const now = new Date();
          const todayDay = now.getDay();

          const isSameDate = (d1, d2) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

          const filteredEvents = response.data.filter(event => {
            const isRepeatingToday =
              event.isRepeating &&
              Array.isArray(event.repeatDays) &&
              event.repeatDays.includes(todayDay);

            if (isRepeatingToday) {
              return true;
            } else {
              const eventDate = new Date(event.date);
              return isSameDate(eventDate, now);
            }
          });

          filteredEvents.sort((a, b) => {
            const timeA = a.startTime.split(':').map(Number);
            const timeB = b.startTime.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
          });

          setEvents(filteredEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodayEvents();

    const interval = setInterval(loadTodayEvents, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getColorClass = (color) => {
    const colorMap = {
      '#2563eb': 'bg-blue-500',
      '#059669': 'bg-green-500',
      '#7c3aed': 'bg-purple-500',
      '#dc2626': 'bg-red-500',
      '#d97706': 'bg-orange-500',
    };
    return colorMap[color] || 'bg-blue-500';
  };

  const timeToPercent = (time) => {
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(0, 0, 0, 0); // Початок дня
    const endTime = new Date(now);
    endTime.setHours(23, 59, 59, 999); // Кінець дня

    const [h, m] = time.split(':').map(Number);
    const eventDate = new Date(now);
    eventDate.setHours(h, m, 0, 0);

    const totalMinutes = 24 * 60; // 24 години
    const minutesFromStart = (eventDate - startTime) / (1000 * 60);

    return (minutesFromStart / totalMinutes) * 100;
  };

  const durationToPercent = (startTime, endTime) => {
    const now = new Date();
    const startOfTimeline = new Date(now);
    startOfTimeline.setHours(0, 0, 0, 0);
    const endOfTimeline = new Date(now);
    endOfTimeline.setHours(23, 59, 59, 999);

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDateTime = new Date(now);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    let endDateTime = new Date(now);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    if (endHour < startHour || (endHour === 0 && startHour > 0)) {
      endDateTime = new Date(endDateTime.getTime() + 24 * 60 * 60 * 1000);
    }

    const totalMinutes = 24 * 60;
    const durationMinutes = (endDateTime - startDateTime) / (1000 * 60);

    return (durationMinutes / totalMinutes) * 100;
  };

  const getTimeLabel = (offsetHours) => {
    const now = new Date();
    const time = new Date(now);
    time.setHours(offsetHours, 0, 0, 0);
    return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-[300px] h-[50px] p-2 rounded-xl flex items-center border ${
      darkTheme ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-opacity-10 bg-gray-500">
          <Calendar className="h-4 w-4" />
        </div>
        <div className="relative flex-1 ml-2">
          <div className={`relative h-5 rounded-full border overflow-hidden ${
            darkTheme ? 'bg-gray-900 border-gray-600' : 'bg-gray-100 border-gray-300'
          } `}>
            <div className="absolute top-0 left-1 h-full w-60">
              <div
                className="absolute top-0 h-full w-0.5 bg-red-500"
                style={{ left: `${timeToPercent(currentTime)}%` }} // Динамічний поточний час
              />
              {events.map((event) => {
                const markerWidth = durationToPercent(event.startTime, event.endTime);
                const markerPosition = timeToPercent(event.startTime);
                const minWidthPercent = 1;
                const adjustedWidth = Math.max(minWidthPercent, markerWidth);

                return (
                  <div
                    key={event.id}
                    className={`absolute top-1/2 transform -translate-y-1/2 h-3 rounded-full ${getColorClass(event.color)} cursor-pointer hover:scale-y-125 transition-transform duration-200 shadow-sm`}
                    style={{
                      left: `${markerPosition}%`,
                      width: `${adjustedWidth}%`,
                    }}
                    onMouseEnter={() => setHoveredEvent(event)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  />
                );
              })}
            </div>
            <div className="absolute top-full left-0 w-full flex justify-between text-[10px] mt-0.5">
              <span>{getTimeLabel(0)}</span>
              <span>{getTimeLabel(12)}</span>
              <span>{getTimeLabel(23)}</span>
            </div>
          </div>
          {hoveredEvent && (
            <div
              className={`absolute z-50 px-2 py-1 rounded-md text-[10px] shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-full -mt-6 ${
                darkTheme ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-200'
              } border`}
              style={{
                left: `calc(${timeToPercent(hoveredEvent.startTime)}% + ${durationToPercent(hoveredEvent.startTime, hoveredEvent.endTime) / 2}%)`,
              }}
            >
              <div className="font-medium">{hoveredEvent.title}</div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {hoveredEvent.startTime} - {hoveredEvent.endTime}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineWidget;