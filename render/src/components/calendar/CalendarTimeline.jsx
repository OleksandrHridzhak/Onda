import { useEffect } from 'react';

export default function CalendarTimeline({
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
        className={`flex flex-col bg-ui-background`}
      >
        <div
          className="flex-1 relative overflow-y-auto custom-scroll-y-light"
          ref={gridRef}
        >
          <div className="flex">
            <div
              className={`w-20 flex-shrink-0 sticky left-0 bg-ui-background z-10`}
            >
              <div className="h-16" />
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={`h-[80px] flex items-start justify-end pr-3 text-sm text-text-secondary -translate-y-2.5`}
                >
                  {formatTime(hour)}
                </div>
              ))}
            </div>

            <div className="flex-1 flex min-w-[120px]">
              {getDisplayDays().map((day, dayIndex) => (
                <div
                  key={day.toDateString()}
                  className={`flex-1 border-l border-ui-border relative`}
                >
                  <div
                    className={`sticky top-0 bg-ui-background z-40 py-3 text-center border-b border-ui-border`}
                  >
                    <div className={`text-xs text-text-secondary`}>
                      {dayNames[day.getDay()]}
                    </div>
                    <div
                      className={`mt-1 text-sm font-medium ${
                        day.toDateString() === new Date().toDateString()
                          ? 'bg-ui-primary text-text-on-primary'
                          : 'text-text-primary'
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
                        className={`absolute w-full border-t border-ui-border hover:bg-ui-hover cursor-pointer z-10`}
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
                          className={`absolute z-30 left-2 right-2 rounded-xl p-2 text-white text-xs shadow-md cursor-pointer ${
                            isShortEvent ? 'short-event' : ''
                          }`}
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
                        className="absolute left-0 right-0 h-[2px] bg-button-danger-background z-30"
                        style={{ top: `${getCurrentTimePosition()}px` }}
                      >
                        <div className="w-3 h-3 bg-button-danger-background rounded-full -translate-y-1" />
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
