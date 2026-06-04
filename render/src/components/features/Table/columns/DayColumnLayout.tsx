import React from 'react';
import { formatDateKey } from '../../../../utils/date';

interface DayColumnLayoutProps {
    weekDates: Date[];
    children: (day: string, dateKey: string) => React.ReactNode;
}
/**
 * Layout component for rendering rows for each day of the week.
 * Accepts a render prop to customize the content of each day's cell.
 *
 * @why Provides a reusable layout for day-based columns in tables.
 *
 *  */
export const DayColumnLayout: React.FC<DayColumnLayoutProps> = ({
    weekDates,
    children,
}) => {
    return (
        <tbody className="bg-surface">
            {weekDates.map((date) => {
                const day = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                });
                const dateKey = formatDateKey(date);

                return (
                    <tr
                        key={dateKey}
                        className="border-b border-border last:border-0"
                    >
                        <td className="px-2 py-3 text-sm text-text">
                            {children(day, dateKey)}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
};
