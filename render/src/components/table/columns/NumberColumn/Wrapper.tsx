import React from 'react';
import { ColumnHeaderContent } from '../shared/ColumnHeaderContent';
import { NumberCell } from './index';
import { DAYS } from '../../TableLogic';

interface NumberColumnWrapperProps {
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}

export const NumberColumnWrapper: React.FC<NumberColumnWrapperProps> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table font-poppins">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
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
                value={tableData[day]?.[column.id] || ''}
                onChange={(newValue) =>
                  handleCellChange(day, column.id, newValue)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
