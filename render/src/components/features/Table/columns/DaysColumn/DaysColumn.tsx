import React from 'react';
import { DAYS } from '../../TableLogic';
import { DayColumnLayout } from '../DayColumnLayout';

export const DaysColumn: React.FC = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

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
                {DAYS.map((day, idx) => (
                    <tr
                        key={day}
                        className={
                            idx !== DAYS.length - 1
                                ? 'border-b border-border'
                                : ''
                        }
                    >
                        <td className="text-left px-4 py-3 text-sm font-medium text-textTableValues  ">
                            {day}
                            {day === today && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
