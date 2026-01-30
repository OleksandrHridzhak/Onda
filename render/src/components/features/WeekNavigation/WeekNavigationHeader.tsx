import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface WeekNavigationHeaderProps {
    weekRange: string;
    weekNumber: number;
    isCurrentWeek: boolean;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onCurrentWeek: () => void;
}

/**
 * Week navigation header component
 * Displays current week range and provides navigation buttons
 */
export const WeekNavigationHeader: React.FC<WeekNavigationHeaderProps> = ({
    weekRange,
    weekNumber,
    isCurrentWeek,
    onPreviousWeek,
    onNextWeek,
    onCurrentWeek,
}) => {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-tableHeader border-b border-border">
            {/* Week info */}
            <div className="flex flex-col">
                <h3 className="text-base font-semibold text-text">
                    {weekRange}
                </h3>
                <p className="text-sm text-textTableValues">
                    Week {weekNumber}
                </p>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center gap-1 p-0.5 bg-hoverBg rounded-xl">
                <button
                    onClick={onPreviousWeek}
                    className="p-2 text-primaryColor hover:text-text hover:bg-sidebarToggleHoverBg rounded-lg transition-colors"
                    aria-label="Previous week"
                    title="Previous week"
                >
                    <ChevronLeft size={18} />
                </button>

                <button
                    onClick={onCurrentWeek}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                        isCurrentWeek
                            ? 'bg-primaryColor text-white cursor-default'
                            : 'text-text bg-background hover:bg-sidebarToggleHoverBg'
                    }`}
                    aria-label="Current week"
                    title="Go to current week"
                    disabled={isCurrentWeek}
                >
                    <Calendar size={14} />
                    <span className="hidden sm:inline">Current</span>
                </button>

                <button
                    onClick={onNextWeek}
                    className="p-2 text-primaryColor hover:text-text hover:bg-sidebarToggleHoverBg rounded-lg transition-colors"
                    aria-label="Next week"
                    title="Next week"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
