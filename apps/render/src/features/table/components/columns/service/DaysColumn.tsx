import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateKey } from "shared/lib/date";
import { useTableWeek } from "features/table/hooks/useTableWeek";
import { Button } from "shared/ui/Button";
import { ColumnWrapper } from "../shared/ColumnWrapper";

const DAYS_COLUMN_WIDTH = 135;

interface DaysColumnProps {
  weekDates?: Date[];
}

/**
 * A column component that displays the days of the week.
 * ! Always exists at the left side of the table.
 */
export const DaysColumn = ({ weekDates: propWeekDates }: DaysColumnProps) => {
  const todayKey = formatDateKey(new Date());
  const {
    weekDates: contextWeekDates,
    weekNumber,
    isCurrentWeek,
    canGoToNextWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = useTableWeek();
  const weekDates = propWeekDates ?? contextWeekDates;

  return (
    <ColumnWrapper width={DAYS_COLUMN_WIDTH} className="border-r border-border">
      <div className="checkbox-nested-table column-days font-poppins flex flex-col h-full w-full">
        <div className="h-[45px] box-border border-b border-border bg-surfaceMuted flex items-center justify-center">
          <div className="flex items-center justify-center gap-1 px-1 text-sm font-medium w-full">
            <Button
              onClick={goToPreviousWeek}
              variant="ghost"
              size="icon"
              aria-label="Previous week"
            >
              <ChevronLeft size={14} />
            </Button>
            <button
              type="button"
              onClick={goToCurrentWeek}
              className={`rounded-lg px-2 py-1 text-xs font-medium ${
                isCurrentWeek
                  ? "border border-border bg-primaryColor/10 text-text"
                  : "text-text hover:bg-backgrundHover"
              }`}
            >
              Week {weekNumber}
            </button>
            <Button
              onClick={goToNextWeek}
              disabled={!canGoToNextWeek}
              variant="ghost"
              size="icon"
              aria-label="Next week"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
        <div className="table-rows-container bg-surface flex flex-col w-full">
          {weekDates.map((date, idx) => {
            const day = date.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const isToday = formatDateKey(date) === todayKey;

            return (
              <div
                key={date.toISOString()}
                className={`table-day-row px-4 py-3 text-left text-sm font-medium text-textMuted flex items-center box-border ${
                  idx !== weekDates.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>{day}</span>
                  {isToday && (
                    <span className="inline-block h-2 w-2 rounded-full bg-primaryColor" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ColumnWrapper>
  );
};
