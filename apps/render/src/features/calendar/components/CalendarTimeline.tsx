import React from "react";
import { Text } from "shared/ui/Text";
import { useCalendarContext } from "../context/CalendarContext";
import {
  calculateEventDurationMinutes,
  formatHour,
  HOURS,
  DAY_NAMES,
} from "../utils/time";
import { formatDateKey } from "shared/lib/date";

export function CalendarTimeline(): React.ReactElement {
  const {
    displayDays,
    slotHeight,
    gridRef,
    currentTime,
    getEventsForDay,
    getEventStyle,
    getCurrentTimePosition,
    openCreateModal,
    openEditModal,
  } = useCalendarContext();

  const todayKey = formatDateKey(currentTime);

  const handleTimeSlotClick = (day: Date, hour: number): void => {
    const startTime = formatHour(hour);
    const endTime = formatHour((hour + 1) % 24);
    openCreateModal(day, startTime, endTime);
  };

  return (
    <div className="w-full mx-auto">
      <div
        style={{ height: "calc(100vh - 100px)" }}
        className="flex flex-col bg-background"
      >
        <div
          className="flex-1 relative overflow-y-auto custom-scroll"
          ref={gridRef}
        >
          <div className="flex">
            <div className="w-14 sm:w-20 flex-shrink-0 sticky left-0 bg-background z-10">
              <div className="h-16" />
              {HOURS.map((hour) => (
                <Text
                  as="div"
                  variant="caption"
                  tone="muted"
                  key={hour}
                  className="flex items-center justify-end pr-2 sm:pr-3 sm:text-sm"
                  style={{
                    height: `${slotHeight}px`,
                    lineHeight: `${slotHeight}px`,
                  }}
                >
                  {formatHour(hour)}
                </Text>
              ))}
            </div>

            <div className="flex-1 flex min-w-[120px]">
              {displayDays.map((day) => {
                const dayKey = formatDateKey(day);
                const isToday = dayKey === todayKey;
                const dayEvents = getEventsForDay(day);

                return (
                  <div
                    key={dayKey}
                    className="flex-1 border-l border-border relative"
                  >
                    <div className="sticky top-0 bg-background z-40 py-3 text-center border-b border-border">
                      <Text variant="caption" tone="muted">
                        {DAY_NAMES[day.getDay()]}
                      </Text>
                      <div
                        className={`mt-1 text-sm font-medium ${
                          isToday ? "bg-primaryColor text-white" : "text-text"
                        } rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mx-auto text-xs sm:text-sm`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                    <div
                      className="relative"
                      style={{
                        height: `${slotHeight * 24}px`,
                      }}
                    >
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          role="button"
                          tabIndex={0}
                          className="absolute w-full border-t border-border hover:bg-primaryColor cursor-pointer z-10"
                          style={{
                            top: `${hour * slotHeight}px`,
                            height: `${slotHeight}px`,
                          }}
                          onClick={() => handleTimeSlotClick(day, hour)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleTimeSlotClick(day, hour);
                            }
                          }}
                          aria-label={`Create event at ${formatHour(hour)}`}
                        />
                      ))}
                      {dayEvents.map((event) => {
                        const duration = calculateEventDurationMinutes(
                          event.startTime,
                          event.endTime,
                        );
                        const isShortEvent = duration <= 30;
                        return (
                          <div
                            key={`${event.id}-${dayKey}`}
                            role="button"
                            tabIndex={0}
                            className={`absolute z-30 left-2 right-2 rounded-xl p-2 text-white text-xs shadow-md cursor-pointer ${
                              isShortEvent ? "short-event" : ""
                            }`}
                            style={getEventStyle(event)}
                            onClick={() => openEditModal(event)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openEditModal(event);
                              }
                            }}
                            title={`${event.title} (${event.startTime} - ${event.endTime})`}
                            aria-label={`Edit event: ${event.title}`}
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
                      {isToday && (
                        <div
                          className="absolute left-0 right-0 h-[2px] bg-red-500 z-30"
                          style={{
                            top: `${getCurrentTimePosition()}px`,
                          }}
                        >
                          <div className="w-3 h-3 bg-red-500 rounded-full -translate-y-1" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarTimeline;
