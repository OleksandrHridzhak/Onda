import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useCalendarEvents } from '../../../../database';

interface Event {
  id: string | number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  isRepeating: boolean;
  repeatDays?: number[];
}

const TimelineWidget: React.FC = () => {
  const getCurrentTimeString = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const { events: calendarEvents } = useCalendarEvents();
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(getCurrentTimeString()),
      60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  const todayEvents = useMemo(() => {
    const now = new Date();
    const todayDay = now.getDay();

    const isSameDate = (d1: Date, d2: Date): boolean =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const filtered = calendarEvents.filter((event) => {
      const isRepeatingToday =
        event.isRepeating && event.repeatDays?.includes(todayDay);
      const isToday = event.date && isSameDate(new Date(event.date), now);
      return isRepeatingToday || isToday;
    });

    // Sort by start time
    return filtered.sort((a, b) => {
      const [hA, mA] = a.startTime.split(':').map(Number);
      const [hB, mB] = b.startTime.split(':').map(Number);
      return hA * 60 + mA - (hB * 60 + mB);
    });
  }, [calendarEvents]);

  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      '#2563eb': 'bg-blue-500',
      '#059669': 'bg-green-500',
      '#7c3aed': 'bg-purple-500',
      '#dc2626': 'bg-red-500',
      '#d97706': 'bg-orange-500',
    };
    return colorMap[color] || 'bg-blue-500';
  };

  const timeToPercent = (time: string): number => {
    const now = new Date();
    const [h, m] = time.split(':').map(Number);
    const eventDate = new Date(now);
    eventDate.setHours(h, m, 0, 0);

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    return (
      ((eventDate.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) * 100
    );
  };

  const durationToPercent = (startTime: string, endTime: string): number => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(sh, sm, 0, 0);

    let endDate = new Date();
    endDate.setHours(eh, em, 0, 0);

    if (endDate < startDate)
      endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

    return (
      ((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) * 100
    );
  };

  const getTimeLabel = (offsetHours: number): string => {
    const now = new Date();
    const t = new Date(now);
    t.setHours(offsetHours, 0, 0, 0);
    return `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`w-[300px] h-[50px] p-2 rounded-xl flex items-center border bg-tableBodyBg border-border text-textTableValues`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-center w-6 h-6 rounded-full ">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="relative flex-1 ml-2">
          <div
            className={`relative h-5 rounded-full border overflow-hidden bg-background border-border`}
          >
            <div className="absolute top-0 left-1 h-full w-60">
              <div
                className="absolute top-0 h-full w-0.5 bg-red-500"
                style={{ left: `${timeToPercent(currentTime)}%` }}
              />
              {todayEvents.map((event) => {
                const width = Math.max(
                  1,
                  durationToPercent(event.startTime, event.endTime),
                );
                const left = timeToPercent(event.startTime);
                return (
                  <div
                    key={event.id}
                    className={`absolute top-1/2 transform -translate-y-1/2 h-3 rounded-full ${getColorClass(event.color)} cursor-pointer hover:scale-y-125 transition-transform duration-200 shadow-sm`}
                    style={{ left: `${left}%`, width: `${width}%` }}
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
              className={`absolute z-50 px-2 py-1 rounded-md text-[10px] shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-full -mt-6 bg-background text-text`}
              style={{
                left: `calc(${timeToPercent(hoveredEvent.startTime)}% + ${
                  durationToPercent(
                    hoveredEvent.startTime,
                    hoveredEvent.endTime,
                  ) / 2
                }%)`,
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
