import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarProvider,
  useCalendarContext,
} from "../context/CalendarContext";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarTimeline } from "./CalendarTimeline";
import { EventModal } from "./EventModal";
import { parseDateKey } from "shared/lib/date";

function CalendarBoardInner(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openCreateModal } = useCalendarContext();

  useEffect(() => {
    if (searchParams.get("createEvent") !== "1") {
      return;
    }

    const dateParam = searchParams.get("date");
    const targetDate = dateParam ? parseDateKey(dateParam) : new Date();
    openCreateModal(targetDate);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("createEvent");
    nextParams.delete("date");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, openCreateModal]);

  return (
    <div className="font-poppins min-h-screen bg-surfaceMuted overflow-y-hidden">
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

      <CalendarHeader />
      <CalendarTimeline />
      <EventModal />
    </div>
  );
}

export function CalendarBoard(): React.ReactElement {
  return (
    <CalendarProvider>
      <CalendarBoardInner />
    </CalendarProvider>
  );
}

export default CalendarBoard;
