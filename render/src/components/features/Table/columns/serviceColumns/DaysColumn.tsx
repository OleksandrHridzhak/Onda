import React from 'react';
import { DAYS } from '../../TableLogic';
import { useWeekNavigationContext } from '../../../WeekNavigation/WeekNavigationContext';

/**
 * A column component that displays the days of the week.
 * ! Always exist at the left side of the table.
 */
export const DaysColumn: React.FC = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const { weekDays } = useWeekNavigationContext();

    return (
        <table className="checkbox-nested-table column-days font-poppins">
            <thead className="bg-tableHeader">
                <tr>
                    <th className="border-b border-border">
                        <div className="px-4 py-3 text-sm font-medium">
                            {'Days'}
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody className="bg-tableBodyBg">
                {DAYS.map((day, idx) => {
                    const date = weekDays[idx];
                    const isToday =
                        day === today &&
                        date &&
                        date.toDateString() === new Date().toDateString();

                    return (
                        <tr
                            key={day}
                            className={
                                idx !== DAYS.length - 1
                                    ? 'border-b border-border'
                                    : ''
                            }
                        >
                            <td className="text-left px-4 py-3 text-sm font-medium text-textTableValues">
                                <div className="flex items-center justify-between">
                                    <span>{day}</span>
                                    <div className="flex items-center gap-2">
                                        {date && (
                                            <span className="text-xs text-textTableValues opacity-60">
                                                {date.getDate()}
                                            </span>
                                        )}
                                        {isToday && (
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
