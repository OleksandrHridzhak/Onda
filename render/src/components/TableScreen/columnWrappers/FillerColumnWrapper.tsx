import React from 'react';
import { DAYS } from '../TableLogic';

export const FillerColumnWrapper: React.FC = () => {
  return (
    <table className="checkbox-nested-table font-poppins">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <div style={{ height: '51.5px' }} />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td style={{ height: '60px' }} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};
