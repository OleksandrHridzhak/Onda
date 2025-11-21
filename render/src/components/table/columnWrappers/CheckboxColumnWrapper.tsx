import React from 'react';
import { ColumnHeaderContent } from './ColumnHeaderContent';
import { CheckboxCell } from '../cells/CheckboxCell';
import { DAYS } from '../TableLogic';
import { useSelector } from 'react-redux';

interface CheckboxColumnWrapperProps {
  columnId: string;
}

export const CheckboxColumnWrapper: React.FC<CheckboxColumnWrapperProps> = ({
  columnId,
}) => {
  const columnData: Record<string, any> = useSelector(
    (state: Record<string, any>) => state.tableData.columns[columnId] || {},
  );

  return (
    <table className="checkbox-nested-table font-poppins">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={columnData}
              columnMenuLogic={() => {}}
              handleMoveColumn={() => {}}
              handleChangeWidth={() => {}}
              columns={[]}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td>
              <CheckboxCell
                checked={columnData.uniqueProperties?.Days?.[day] || false}
                onChange={() => console.log('hello')}
                color={columnData.uniqueProperties?.CheckboxColor || '#3b82f6'}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
