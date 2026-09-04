import React from 'react';
import { formatDateKey } from 'shared/lib/date';

interface DayColumnLayoutProps {
    weekDates: Date[];
    children: (day: string, dateKey: string) => React.ReactNode;
}

/**
 * Layout component for rendering rows for each day of the week as pure divs.
 */
export const DayColumnLayout = ({
    weekDates,
    children,
}: DayColumnLayoutProps) => {
    return (
        <div className="table-rows-container bg-surface flex flex-col w-full">
            {weekDates.map((date) => {
                const day = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                });
                const dateKey = formatDateKey(date);

                return (
                    <div
                        key={dateKey}
                        className="table-day-row border-b border-border last:border-0 px-2 py-3 text-sm text-text flex items-center justify-center box-border w-full"
                    >
                        {children(day, dateKey)}
                    </div>
                );
            })}
        </div>
    );
};
