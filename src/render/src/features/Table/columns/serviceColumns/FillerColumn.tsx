import React from 'react';
import { DAYS } from 'features/Table/TableLogic';

/**
 * A column component that displays the empty space of the table.
 * ! Always exist at the right side of the table if there are no any other columns.
 */
interface FillerColumnProps {
    hideRowBorders?: boolean;
}

export const FillerColumn: React.FC<FillerColumnProps> = ({
    hideRowBorders = false,
}) => {
    return (
        <table className="checkbox-nested-table font-poppins">
            <thead className="bg-surfaceMuted">
                <tr>
                    <th className="border-b border-border">
                        <div />
                    </th>
                </tr>
            </thead>
            <tbody className="bg-surface">
                {DAYS.map((day, idx) => (
                    <tr
                        key={day}
                        className={
                            idx !== DAYS.length - 1
                                ? `border-b ${
                                      hideRowBorders
                                          ? 'border-transparent'
                                          : 'border-border'
                                  }`
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
