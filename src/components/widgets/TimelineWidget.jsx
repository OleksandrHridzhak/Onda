import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const TimelineWidget = ({ darkTheme = false }) => {
  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodayEvents = async () => {
      try {
        setLoading(true);
        const response = await window.electronAPI.calendarGetEvents();
        if (response.status === 'success') {
          const now = new Date();

          const filteredEvents = response.data.filter(event => {
            const eventDate = new Date(event.date);
            const eventTime = event.startTime.split(':').map(Number);
            eventDate.setHours(eventTime[0], eventTime[1], 0, 0);

            const eventEndTime = event.endTime.split(':').map(Number);
            const eventEndDate = new Date(event.date);
            eventEndDate.setHours(eventEndTime[0], eventEndTime[1], 0, 0);

            return eventDate >= new Date(now.getTime() - 2 * 60 * 60 * 1000) || 
                   (eventDate <= now && eventEndDate >= now);
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
    const startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // -2 hours
    const endTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);   // +8 hours
    const [h, m] = time.split(':').map(Number);
    const eventDate = new Date(now);
    eventDate.setHours(h, m, 0, 0);

    const totalMinutes = 10 * 60; // 10 hours
    const minutesFromStart = (eventDate - startTime) / (1000 * 60);

    return (minutesFromStart / totalMinutes) * 100;
  };

  const getTimeLabel = (offsetHours) => {
    const now = new Date();
    const time = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
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
            {/* Timeline bar */}
            <div className="absolute top-0 left-0 h-full w-full">
              {/* Current time marker */}
              <div
                className="absolute top-0 h-full w-0.5 bg-red-500"
                style={{ left: '20%' }} // -2h to 0h is 2/10 = 20%
              />
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${getColorClass(event.color)} cursor-pointer hover:scale-125 transition-transform duration-200 shadow-sm`}
                  style={{ left: `calc(${timeToPercent(event.startTime)}% + ${index * 4}px)` }}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                />
              ))}
            </div>
            {/* Time labels */}
            <div className="absolute top-full left-0 w-full flex justify-between text-[10px] mt-0.5">
              <span>{getTimeLabel(-2)}</span>
              <span>{getTimeLabel(0)}</span>
              <span>{getTimeLabel(8)}</span>
            </div>
          </div>
          {hoveredEvent && (
            <div
              className={`absolute z-50 px-2 py-1 rounded-md text-[10px] shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-full -mt-6 ${
                darkTheme ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-200'
              } border`}
              style={{ left: `${timeToPercent(hoveredEvent.startTime)}%` }}
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