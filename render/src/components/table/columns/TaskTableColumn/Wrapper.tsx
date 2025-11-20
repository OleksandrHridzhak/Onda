import React from 'react';
import { ColumnHeaderContent } from '../shared/ColumnHeaderContent';
import { TaskTableCell } from './index';
import { DAYS } from '../../TableLogic';

interface TaskTableColumnWrapperProps {
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  handleChangeOptions: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}

export const TaskTableColumnWrapper: React.FC<TaskTableColumnWrapperProps> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  handleChangeOptions,
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
        <tr>
          <td
            className="px-2 py-3 text-sm text-textTableRealValues todo-cell"
            style={{ verticalAlign: 'top' }}
            rowSpan={DAYS.length}
          >
            <TaskTableCell
              column={column}
              onChangeOptions={handleChangeOptions}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
