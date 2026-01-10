import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { CheckboxCell } from './CheckboxCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';

interface CheckboxColumnProps {
  columnId: string;
}

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({ columnId }) => {
  const {
    columnData,
    updateColumnNested,
    handleMoveColumn,
    handleChangeWidth,
    columnMenuLogic,
    columns,
    columnForHeader: baseColumnForHeader,
  } = useColumnLogic({
    columnId,
    clearValue: false,
  });

  const handleCheckboxChange = (day: string, newValue: boolean) => {
    updateColumnNested(['Days', day], newValue);
  };

  const uniqueProps =
    (columnData.uniqueProperties as Record<string, unknown>) || {};

  const columnForHeader = {
    ...baseColumnForHeader,
    checkboxColor: uniqueProps.CheckboxColor,
  };

  return (
    <table className="checkbox-nested-table column-checkbox font-poppins">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={columnForHeader}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
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
                checked={
                  (uniqueProps.Days as Record<string, boolean>)?.[day] || false
                }
                onChange={(newValue) => handleCheckboxChange(day, newValue)}
                color={(uniqueProps.CheckboxColor as string) || '#3b82f6'}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
