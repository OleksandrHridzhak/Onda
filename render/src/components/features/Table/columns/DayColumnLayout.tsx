import React from 'react';
import { DAYS } from '../TableLogic';

interface DayColumnLayoutProps {
    children: (day: string) => React.ReactNode;
}
/**
 * Layout component for rendering rows for each day of the week.
 * Accepts a render prop to customize the content of each day's cell.
 *
 * @why Provides a reusable layout for day-based columns in tables.
 *
 *  */
export const DayColumnLayout: React.FC<DayColumnLayoutProps> = ({
    children,
}) => {
    return (
        <tbody className="bg-tableBodyBg">
            {DAYS.map((day) => (
                <tr key={day} className="border-b border-border last:border-0">
                    <td className="px-2 py-3 text-sm text-textTableRealValues">
                        {children(day)}
                    </td>
                </tr>
            ))}
        </tbody>
    );
};
