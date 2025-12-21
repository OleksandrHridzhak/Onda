import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { BubbleBtn } from '../../shared/BubbleBtn';

interface NewEvent {
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: string;
}

interface CalendarHeaderProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  selectedDate: Date;
  weekDays: Date[];
  currentWeekStart: Date;
  getWeekNumber: (date: Date) => number;
  goToPrevious: () => void;
  goToCurrent: () => void;
  goToNext: () => void;
  setNewEvent: (event: NewEvent) => void;
  setEditingEventId: (id: string | null) => void;
  setShowEventModal: (show: boolean) => void;
}

export default function CalendarHeader({
  viewMode,
  setViewMode,
  selectedDate,
  weekDays,
  currentWeekStart,
  getWeekNumber,
  goToPrevious,
  goToCurrent,
  goToNext,
  setNewEvent,
  setEditingEventId,
  setShowEventModal,
}: CalendarHeaderProps): React.ReactElement {
  return (
    <div
      className={`sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl bg-hoverBg`}>
            <CalendarIcon size={22} className="text-primaryColor" />
          </div>
          <div className="flex flex-col">
            <h2 className={`text-xl font-semibold tracking-tight text-text`}>
              {viewMode === 'day'
                ? selectedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : weekDays[0]?.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
            </h2>
            <p className={`text-sm text-textTableValues`}>
              {viewMode === 'day'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][
                    selectedDate.getDay()
                  ]
                : `Week ${getWeekNumber(currentWeekStart)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`flex items-center gap-1 p-1 bg-hoverBg rounded-xl`}>
            <button
              onClick={goToPrevious}
              className={`p-2 text-primaryColor hover:text-text hover:bg-sidebarToggleHoverBg rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Previous day' : 'Previous week'}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToCurrent}
              className={`px-3 py-1.5 text-sm text-text bg-background hover:bg-sidebarToggleHoverBg rounded-lg transition-colors`}
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className={`p-2 text-primaryColor hover:text-text hover:bg-sidebarToggleHoverBg rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Next day' : 'Next week'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="relative">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className={`appearance-none w-37 px-3 pr-10 py-1.5 text-sm border-border bg-background text-textTableValues rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor border`}
            >
              <option value="week">Week View</option>
              <option value="day">Day View</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-textTableValues">
              <ChevronDown size={16} />
            </div>
          </div>
          <BubbleBtn
            onClick={() => {
              setNewEvent({
                title: '',
                startTime: '09:00',
                endTime: '10:00',
                color: '#2563eb',
                isRepeating: false,
                repeatDays: [],
                repeatFrequency: 'weekly',
              });
              setEditingEventId(null);
              setShowEventModal(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            New Event
          </BubbleBtn>
        </div>
      </div>
    </div>
  );
}
