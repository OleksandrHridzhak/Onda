import React from 'react';
import { formatDateKey } from 'app/utils/date';

interface DaysColumnProps {
    weekDates: Date[];
}

/**
 * A column component that displays the days of the week.
 * ! Always exist at the left side of the table.
 */
export const DaysColumn: React.FC<DaysColumnProps> = ({ weekDates }) => {
    const todayKey = formatDateKey(new Date());

    return (
        <table className="checkbox-nested-table column-days font-poppins">
            <thead className="bg-surfaceMuted">
                <tr>
                    <th className="border-b border-border">
                        <div className="px-4 py-3 text-sm font-medium">
                            {'Days'}
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
                                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
