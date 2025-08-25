import { useEffect } from 'react';

export default function CalendarTimeline({
  darkTheme,
  viewMode,
  selectedDate,
  weekDays,
  currentTime,
  hours,
  slotHeight,
  dayNames,
  gridRef,
  formatTime,
  timeToMinutes,
  getEventsForDay,
  getEventStyle,
  getCurrentTimePosition,
  handleTimeSlotClick,
  handleEditEvent,
}) {
  const getDisplayDays = () => {
    return viewMode === 'day' ? [selectedDate] : weekDays;
  };

  // Auto-scroll to current time
  useEffect(() => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const scrollPosition =
      (minutes / 60) * slotHeight -
      gridRef.current.clientHeight / 2 +
      slotHeight / 2;
    gridRef.current.scrollTo({ top: Math.max(0, scrollPosition) });
  }, [currentTime, gridRef, slotHeight]);

  return (
    <div className="w-full mx-auto">
      <div
        style={{ height: 'calc(100vh - 100px)' }}
        className={`flex flex-col ${darkTheme ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div
          className="flex-1 relative overflow-y-auto custom-scroll-y-light"
          ref={gridRef}
        >
          <div className="flex">
            {/* Hour labels */}
            <div
              className={`w-20 flex-shrink-0 sticky left-0 ${darkTheme ? 'bg-gray-800' : 'bg-white'} z-10`}
            >
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
                <div
                  key={day.toDateString()}
                  className={`flex-1 ${darkTheme ? 'border-gray-700' : 'border-gray-200'} border-l relative`}
                >
                  <div
                    className={`sticky top-0 ${darkTheme ? 'bg-gray-800' : 'bg-white'} z-40 py-3 text-center ${darkTheme ? 'border-gray-700' : 'border-gray-200'} border-b`}
                  >
                    <div
                      className={`text-xs ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {dayNames[day.getDay()]}
                    </div>
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
                  <div
                    className="relative"
                    style={{ height: `${slotHeight * 24}px` }}
                  >
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className={`absolute w-full ${darkTheme ? 'border-gray-700' : 'border-gray-200'} border-t ${darkTheme ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} cursor-pointer z-10`}
                        style={{
                          top: `${hour * slotHeight}px`,
                          height: `${slotHeight}px`,
                        }}
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
                              <div className="event-title font-medium">
                                {event.title}
                              </div>
                              <div className="event-time truncate">
                                {event.startTime} - {event.endTime}
                              </div>
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
  );
}
