import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { BubbleBtn } from '../shared/BubbleBtn';

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
}) {
  return (
    <div
      className={`sticky top-0 z-20 bg-ui-background/95 backdrop-blur-sm border-b border-ui-border`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl bg-ui-hover`}>
            <CalendarIcon size={22} className="text-text-accent" />
          </div>
          <div className="flex flex-col">
            <h2 className={`text-xl font-semibold tracking-tight text-text-primary`}>
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
            <p className={`text-sm text-text-secondary`}>
              {viewMode === 'day'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][
                    selectedDate.getDay()
                  ]
                : `Week ${getWeekNumber(currentWeekStart)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`flex items-center gap-1 p-1 bg-ui-hover rounded-xl`}>
            <button
              onClick={goToPrevious}
              className={`p-2 text-text-accent hover:text-text-primary hover:bg-sidebar-background-hover rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Previous day' : 'Previous week'}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToCurrent}
              className={`px-3 py-1.5 text-sm text-text-primary bg-ui-background hover:bg-sidebar-background-hover rounded-lg transition-colors`}
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className={`p-2 text-text-accent hover:text-text-primary hover:bg-sidebar-background-hover rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Next day' : 'Next week'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="relative">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className={`appearance-none w-37 px-3 pr-10 py-1.5 text-sm border-ui-border bg-ui-background text-text-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary border`}
            >
              <option value="week">Week View</option>
              <option value="day">Day View</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
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
            className={`px-4 py-1.5 text-sm text-text-on-primary bg-button-primary-background hover:bg-button-primary-background-hover rounded-xl flex items-center gap-2 transition-colors shadow-sm hover:shadow-md`}
          >
            <Plus size={16} className="mr-2" />
            New Event
          </BubbleBtn>
        </div>
      </div>
    </div>
  );
}
