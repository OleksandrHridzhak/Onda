import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { NotesCell } from './NotesCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { updateColumnNested } from '../../../../../store/tableSlice/tableSlice';

interface NotesColumnProps {
  columnId: string;
}

export const NotesColumn: React.FC<NotesColumnProps> = ({ columnId }) => {
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
        path: ['Days', day],
        value: newValue,
      }),
    );
  };

  return (
    <table className="checkbox-nested-table font-poppins">
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
              <NotesCell
                value={columnData.uniqueProperties?.Days?.[day] || ''}
                onChange={(newValue) => handleCellChange(day, newValue)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
