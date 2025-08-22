import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, ChevronDown } from 'lucide-react';
import { BubbleBtn } from '../shared/BubbleBtn';

export default function CalendarHeader({
  darkTheme,
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
    <div className={`sticky top-0 z-20 ${darkTheme ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700' : 'bg-white/95 backdrop-blur-sm border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${darkTheme ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
            <CalendarIcon size={22} className={darkTheme ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <div className="flex flex-col">
            <h2 className={`text-xl font-semibold tracking-tight ${darkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
              {viewMode === 'day'
                ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : weekDays[0]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <p className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              {viewMode === 'day' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][selectedDate.getDay()] : `Week ${getWeekNumber(currentWeekStart)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`flex items-center gap-1 p-1 ${darkTheme ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-xl`}>
            <button
              onClick={goToPrevious}
              className={`p-2 ${darkTheme ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' : 'text-blue-600 hover:text-blue-800 hover:bg-gray-200'} rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Previous day' : 'Previous week'}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToCurrent}
              className={`px-3 py-1.5 text-sm ${darkTheme ? 'text-gray-300 bg-gray-600/50 hover:bg-gray-500' : 'text-gray-700 bg-white hover:bg-gray-50'} rounded-lg transition-colors`}
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className={`p-2 ${darkTheme ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' : 'text-blue-600 hover:text-blue-800 hover:bg-gray-200'} rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Next day' : 'Next week'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="relative">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className={`appearance-none w-37 px-3 pr-10 py-1.5 text-sm ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border`}
            >
              <option value="week">Week View</option>
              <option value="day">Day View</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>
          <button
            onClick={() => {
              setNewEvent({ title: '', startTime: '09:00', endTime: '10:00', color: '#2563eb', isRepeating: false, repeatDays: [], repeatFrequency: 'weekly' });
              setEditingEventId(null);
              setShowEventModal(true);
            }}
            className={`px-4 py-1.5 text-sm text-white ${darkTheme ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl flex items-center gap-2 transition-colors shadow-sm hover:shadow-md`}
          >
            <Plus size={16} />
            New Event
          </button>
        </div>
      </div>
    </div>
  );
}