import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from 'shared/ui/Button';
import { getWeekDates } from 'app/utils/date';
import { useTableWeek } from 'features/Table/context/TableWeekContext';

const WeekSwitcherWidget: React.FC = () => {
    const {
        currentWeekStart,
        canGoToNextWeek,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
    } = useTableWeek();

    const weekDates = React.useMemo(
        () => getWeekDates(currentWeekStart),
        [currentWeekStart],
    );

    const weekRangeLabel = React.useMemo(() => {
        const startLabel = weekDates[0].toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
        });
        const endLabel = weekDates[weekDates.length - 1].toLocaleDateString(
            'en-US',
            {
                month: 'numeric',
                day: 'numeric',
            },
        );

        return `${startLabel}-${endLabel}`;
    }, [weekDates]);

    return (
        <div className=" mx-2 flex h-[50px] items-center gap-0.5 rounded-xl border border-border bg-surface px-1.5 text-text">
            <Button
                onClick={goToPreviousWeek}
                variant="ghost"
                className="!min-w-0 !gap-0 !px-1 !py-1"
            >
                <ChevronLeft size={12} />
            </Button>
            <button
                type="button"
                onClick={goToCurrentWeek}
                className="min-w-[56px] rounded-lg px-1.5 py-1 text-center transition-colors hover:bg-backgrundHover"
            >
                <div className="text-[9px] uppercase tracking-wide text-textSubtle">
                    Week
                </div>
                <div className="text-[10px] font-medium leading-tight">
                    {weekRangeLabel}
                </div>
            </button>
            <Button
                onClick={goToNextWeek}
                disabled={!canGoToNextWeek}
                variant="ghost"
                className="!min-w-0 !gap-0 !px-1 !py-1"
            >
                <ChevronRight size={12} />
            </Button>
        </div>
    );
};

export default WeekSwitcherWidget;
