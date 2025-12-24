import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

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
}: CalendarHeaderProps): React.ReactElement {
  // Helpers for responsive date formatting
  const formatDayFull = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  const formatDayShort = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const formatWeekRangeFull = (days: Date[]) => {
    if (!days || days.length === 0) return '';
    const start = days[0];
    const end = days[days.length - 1];
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const formatWeekRangeShort = (days: Date[]) => {
    if (!days || days.length === 0) return '';
    const start = days[0];
    const end = days[days.length - 1];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const dayFull = formatDayFull(selectedDate);
  const dayShort = formatDayShort(selectedDate);
  const weekFull = formatWeekRangeFull(weekDays);
  const weekShort = formatWeekRangeShort(weekDays);

  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width?: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        viewMenuRef.current &&
        !viewMenuRef.current.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setViewMenuOpen(false);
      }
    };

    const updatePos = () => {
      if (menuButtonRef.current) {
        const rect = menuButtonRef.current.getBoundingClientRect();
        const menuWidth = 112; // matches w-28 (28 * 4 = 112px)
        const margin = 8;
        const viewportLeft = window.scrollX || 0;
        const viewportRight =
          (window.innerWidth || document.documentElement.clientWidth) +
          viewportLeft;
        // Default left aligned with button
        let left = rect.left + viewportLeft;
        // If menu would overflow on the right, shift it left so it stays within viewport with a margin
        if (left + menuWidth + margin > viewportRight) {
          left = Math.max(
            viewportLeft + margin,
            viewportRight - menuWidth - margin,
          );
        }
        // Ensure we don't position off the left edge
        left = Math.max(left, viewportLeft + margin);

        setMenuPos({
          top: rect.bottom + window.scrollY + 8,
          left,
          width: rect.width,
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);

    if (viewMenuOpen) updatePos();

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [viewMenuOpen]);

  return (
    <div
      className={`sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex flex-row items-center justify-between gap-2 flex-nowrap">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
          <div
            className={`hidden sm:flex p-2 sm:p-3 rounded-2xl bg-hoverBg items-center justify-center`}
          >
            <CalendarIcon size={22} className="text-primaryColor" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2
              className={`text-base sm:text-lg font-semibold tracking-tight text-text leading-tight truncate`}
            >
              {/* Compact on xs, full on sm+ */}
              {viewMode === 'day' ? (
                <>
                  <span className="block sm:hidden truncate">{dayShort}</span>
                  <span className="hidden sm:block">{dayFull}</span>
                </>
              ) : (
                <>
                  <span className="block sm:hidden truncate">{weekShort}</span>
                  <span className="hidden sm:block">{weekFull}</span>
                </>
              )}
            </h2>
            <p
              className={`text-sm text-textTableValues mt-0.5 hidden sm:block`}
            >
              {viewMode === 'day'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][
                    selectedDate.getDay()
                  ]
                : `Week ${getWeekNumber(currentWeekStart)}`}
            </p>
          </div>
        </div>

        {/* Right: Navigation + View Controls */}
        <div className="flex items-center gap-1 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Navigation group */}
          <div
            className={`flex items-center gap-1 p-0.5 bg-hoverBg rounded-xl`}
          >
            <button
              onClick={goToPrevious}
              className={`p-1.5 sm:p-2 text-primaryColor hover:text-text hover:bg-sidebarToggleHoverBg rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Previous day' : 'Previous week'}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Today: text on md+, short date on xs/sm */}
            <button
              onClick={goToCurrent}
              className={`px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm text-text bg-background hover:bg-sidebarToggleHoverBg rounded-lg transition-colors flex items-center gap-2`}
              aria-label="Today"
            >
              <span className="hidden md:inline">Today</span>
              <span className="inline md:hidden">
                <CalendarIcon size={14} className="text-primaryColor" />
              </span>
            </button>

            <button
              onClick={goToNext}
              className={`p-1.5 sm:p-2 text-primaryColor hover:text-text hover:bg-sidebarToggleHoverBg rounded-lg transition-colors`}
              aria-label={viewMode === 'day' ? 'Next day' : 'Next week'}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View toggles: segmented on md+, compact select on xs */}
          <div className="hidden md:flex items-center gap-2 bg-hoverBg p-1 rounded-xl">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${viewMode === 'week' ? 'bg-primaryColor text-white' : 'text-textTableValues hover:bg-[rgba(0,0,0,0.04)]'}`}
              aria-pressed={viewMode === 'week'}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${viewMode === 'day' ? 'bg-primaryColor text-white' : 'text-textTableValues hover:bg-[rgba(0,0,0,0.04)]'}`}
              aria-pressed={viewMode === 'day'}
            >
              Day
            </button>
          </div>

          <div className="md:hidden relative" ref={viewMenuRef}>
            <button
              ref={menuButtonRef}
              onClick={() => setViewMenuOpen((v) => !v)}
              className={`flex items-center gap-1 p-1.5 sm:p-2 text-xs rounded-lg bg-hoverBg border border-transparent focus:outline-none items-center justify-center`}
              aria-haspopup="true"
              aria-expanded={viewMenuOpen}
            >
              <span className="sr-only">View mode</span>
              <span className="text-textTableValues">
                {viewMode === 'week' ? 'W' : 'D'}
              </span>
              <ChevronDown size={14} />
            </button>
            {viewMenuOpen &&
              menuPos &&
              createPortal(
                <div
                  ref={viewMenuRef}
                  className="w-28 bg-background border border-border rounded-lg shadow-md"
                  style={{
                    position: 'fixed',
                    top: menuPos.top,
                    left: menuPos.left,
                    zIndex: 99999,
                  }}
                >
                  <button
                    onClick={() => {
                      setViewMode('week');
                      setViewMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm ${viewMode === 'week' ? 'bg-primaryColor text-white rounded-t-lg' : 'text-textTableValues hover:bg-[rgba(0,0,0,0.03)]'}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('day');
                      setViewMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm ${viewMode === 'day' ? 'bg-primaryColor text-white rounded-b-lg' : 'text-textTableValues hover:bg-[rgba(0,0,0,0.03)]'}`}
                  >
                    Day
                  </button>
                </div>,
                document.body,
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
