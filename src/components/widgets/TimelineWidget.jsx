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

            return eventDate >= now || (eventDate <= now && eventEndDate >= now);
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

    const interval = setInterval(() => {
      loadTodayEvents();
    }, 60 * 1000);

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
    const [h, m] = time.split(':').map(Number);
    const eventDate = new Date(now);
    eventDate.setHours(h, m, 0, 0);

    const totalMinutes = 8 * 60;
    const minutesFromStart = (eventDate - now) / (1000 * 60);

    return (minutesFromStart / totalMinutes) * 100;
  };

  return (
    <div className={`w-[200px] h-[50px] ml-2 justify-center px-2 rounded-xl flex flex-col items-center space-y-2 border ${darkTheme ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-1" />
        </div>

        <div className="relative w-full ml-4">
          <div className={`relative flex-1 h-8 ${darkTheme ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-800'} rounded-full border overflow-hidden`}>
            <div className="absolute top-0 left-6 h-full w-full">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${getColorClass(event.color)} cursor-pointer hover:scale-110 transition-transform duration-200`}
                  style={{ left: `calc(${timeToPercent(event.startTime)}% + ${index * 10}px)` }}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                />
              ))}
            </div>
          </div>
          {hoveredEvent && (
            <div
              className={`absolute z-50 px-2 py-1 rounded-md text-xs shadow-md whitespace-nowrap transform -translate-x-1/2 -translate-y-full pointer-events-none
                ${darkTheme ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
              style={{ left: `${timeToPercent(hoveredEvent.startTime)}%`, top: '-12px' }}
            >
              <div>{hoveredEvent.title}</div>
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
