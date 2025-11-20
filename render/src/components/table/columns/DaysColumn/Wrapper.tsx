import React from 'react';
import { DAYS } from '../../TableLogic';

interface DaysColumnWrapperProps {
  column: any;
}

export const DaysColumnWrapper: React.FC<DaysColumnWrapperProps> = ({
  column,
}) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <table className="checkbox-nested-table font-poppins">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <div className="px-4 py-3 text-sm font-medium">
              {column.name || 'Days'}
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td className="px-4 py-3 text-sm font-medium text-textTableValues whitespace-nowrap">
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
