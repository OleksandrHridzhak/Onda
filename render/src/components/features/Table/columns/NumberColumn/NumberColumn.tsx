import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { NumberCell } from './NumberCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { updateColumnNested } from '../../../../../store/tableSlice/tableSlice';

interface NumberColumnProps {
  columnId: string;
}

export const NumberColumn: React.FC<NumberColumnProps> = ({ columnId }) => {
  const {
    columnData,
    dispatch,
    handleMoveColumn,
    handleChangeWidth,
    columnMenuLogic,
    columns,
    columnForHeader,
  } = useColumnLogic({
    columnId,
    clearValue: '',
  });

  const handleCellChange = (day: string, newValue: string) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['days', day],
        value: newValue,
      }),
    );
  };

  return (
    <table className="checkbox-nested-table column-numberbox font-poppins">
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
            <td className="px-2 py-3 text-sm text-textTableRealValues">
              <NumberCell
                value={columnData.days?.[day] || ''}
                onChange={(newValue) => handleCellChange(day, newValue)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
