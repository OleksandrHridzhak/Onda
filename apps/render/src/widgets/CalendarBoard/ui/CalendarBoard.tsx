import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EventModal } from 'features/ManageCalendarEvent';
import CalendarHeader from './CalendarHeader';
import CalendarTimeline from './CalendarTimeline';
import { useCalendar, NewEvent } from 'features/ManageCalendarEvent';
import { useCalendarLayout } from '../model/useCalendarLayout';
import { CalendarEntry } from 'entities/CalendarEvent';

export default function Calendar(): React.ReactElement {
    // Calendar state & logic moved into hooks: `useCalendar` and `useCalendarLayout`.

    const calendar = useCalendar();
    const [searchParams, setSearchParams] = useSearchParams();
    const layout = useCalendarLayout(calendar.events);

    const {
        viewMode,
        setViewMode,
        selectedDate,
        weekDays,
        currentWeekStart,
        getWeekNumber,
        goToPrevious,
        goToCurrent,
        goToNext,
        formatTime,
        timeToMinutes,
        getEventsForDay,
        getEventStyle,
        getCurrentTimePosition,
        hours,
        slotHeight,
        dayNames,
        gridRef,
        currentTime,
    } = layout;

    const {
        showEventModal,
        setShowEventModal,
        newEvent,
        setNewEvent,
        editingEventId,
        createOrUpdateEvent,
        deleteEvent,
        validateTime,
        adjustEventTimes,
        openNewEventAt,
        startEditing,
    } = calendar;

    const setViewModeWrapper = (mode: string): void =>
        setViewMode(mode as 'week' | 'day');

    const handleTimeSlotClick = (dayIndex: number, hour: number): void => {
        const startTime = formatTime(hour);
        const endTime = formatTime((hour + 1) % 24);
        const selectedDay =
            viewMode === 'day' ? selectedDate : weekDays[dayIndex];
        openNewEventAt(selectedDay, startTime, endTime);
    };

    const handleEditEvent = (event: CalendarEntry): void => {
        startEditing(event);
    };

    const handleSaveEvent = async (): Promise<void> => {
        if (
            !newEvent.title?.trim() ||
            !validateTime(newEvent.startTime) ||
            !validateTime(newEvent.endTime)
        )
            return;
        await createOrUpdateEvent({
            ...(newEvent as NewEvent),
            id: editingEventId || undefined,
        });
    };

    const handleDeleteEvent = async (eventId: string): Promise<void> => {
        await deleteEvent(eventId);
    };

    useEffect(() => {
        if (searchParams.get('createEvent') !== '1') {
            return;
        }

        const dateParam = searchParams.get('date');
        openNewEventAt(dateParam ? new Date(dateParam) : new Date());

        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.delete('createEvent');
        nextSearchParams.delete('date');
        setSearchParams(nextSearchParams, { replace: true });
    }, [openNewEventAt, searchParams, setSearchParams]);

    return (
        <div
            className={`font-poppins min-h-screen bg-surfaceMuted overflow-y-hidden`}
        >
            <style>{`
        .custom-checkbox {
          position: relative;
          width: 18px;
          height: 18px;
          appearance: none;
          background: var(--background);
          border: 2px solid var(--border);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .custom-checkbox:checked {
          background: var(--primary);
          border-color: var(--primary);
        }
        .custom-checkbox:checked::after {
          content: '✔';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--sidebar-icon-active);
          font-size: 12px;
        }
        .custom-checkbox:hover {
          border-color: var(--text-muted);
        }
        .custom-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--primary);
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
                setViewMode={setViewModeWrapper}
                selectedDate={selectedDate}
                weekDays={weekDays}
                currentWeekStart={currentWeekStart}
                getWeekNumber={getWeekNumber}
                goToPrevious={goToPrevious}
                goToCurrent={goToCurrent}
                goToNext={goToNext}
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
