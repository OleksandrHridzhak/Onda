import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateKey } from 'shared/lib/date';
import { useTableWeek } from 'features/table/hooks/useTableWeek';
import { Button } from 'shared/ui/Button';
import { ColumnWrapper } from '../../shared/ColumnWrapper';

const DAYS_COLUMN_WIDTH = 135;

interface DaysColumnProps {
    weekDates?: Date[];
}

/**
 * A column component that displays the days of the week.
 * ! Always exist at the left side of the table.
 */
export const DaysColumn = ({
    weekDates: propWeekDates,
}: DaysColumnProps) => {
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
        <ColumnWrapper
            width={DAYS_COLUMN_WIDTH}
            className="border-r border-border"
        >
            <table className="checkbox-nested-table column-days font-poppins">
                <thead className="bg-surfaceMuted">
                    <tr>
                        <th className="border-b border-border">
                            <div className="justify-center gap-1 px-1 text-sm font-medium">
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
                                            ? 'border border-border bg-primaryColor/10 text-text'
                                            : 'text-text hover:bg-backgrundHover'
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
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-surface">
                    {weekDates.map((date, idx) => {
                        const day = date.toLocaleDateString('en-US', {
                            weekday: 'long',
                        });
                        const isToday = formatDateKey(date) === todayKey;

                        return (
                            <tr
                                key={date.toISOString()}
                                className={
                                    idx !== weekDates.length - 1
                                        ? 'border-b border-border'
                                        : ''
                                }
                            >
                                <td className="px-4 py-3 text-left text-sm font-medium text-textMuted">
                                    <div className="flex items-center justify-between gap-2">
                                        <span>{day}</span>
                                        {isToday && (
                                            <span className="inline-block h-2 w-2 rounded-full bg-primaryColor" />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </ColumnWrapper>
    );
};
