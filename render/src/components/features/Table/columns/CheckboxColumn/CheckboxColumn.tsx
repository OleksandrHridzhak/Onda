import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { CheckboxCell } from './CheckboxCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { updateColumnNested } from '../../../../../store/tableSlice/tableSlice';

interface CheckboxColumnProps {
  columnId: string;
}

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({ columnId }) => {
  const {
    columnData,
    dispatch,
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
    dispatch(
      updateColumnNested({
        columnId,
        path: ['days', day],
        value: newValue,
      }),
    );
  };

  const columnForHeader = {
    ...baseColumnForHeader,
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
                checked={columnData.days?.[day] || false}
                onChange={(newValue) => handleCheckboxChange(day, newValue)}
                color={columnData.checkboxColor || '#3b82f6'}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
