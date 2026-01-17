import React from 'react';
import { DAYS } from '../../TableLogic';

/**
 * A column component that displays the empty space of the table.
 * ! Always exist at the right side of the table if there are no any other columns.
 */
export const FillerColumn: React.FC = () => {
    return (
        <table className="checkbox-nested-table font-poppins">
            <thead className="bg-tableHeader">
                <tr>
                    <th className="border-b border-border">
                        <div />
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
                        <td style={{ height: '60px' }} />
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
