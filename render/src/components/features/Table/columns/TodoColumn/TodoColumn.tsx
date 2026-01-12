import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TodoCell } from './TodoCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import {
  updateColumnNested,
  updateCommonColumnProperties,
} from '../../../../../store/tableSlice/tableSlice';

interface TodoColumnProps {
  columnId: string;
}

export const TodoColumn: React.FC<TodoColumnProps> = ({ columnId }) => {
  const customClearColumn = () => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['globalTodos'],
        value: [],
      }),
    );
  };

  const customHandleChangeOptions = (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => {
    dispatch(
      updateCommonColumnProperties({
        columnId: id,
        properties: {
          options,
          tagColors,
        },
      }),
    );
  };

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
    customClearColumn,
    customHandleChangeOptions,
  });

  const handleCellChange = (newValue: any) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['globalTodos'],
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
        <tr>
          <td
            className="px-2 py-3 text-sm text-textTableRealValues todo-cell"
            style={{ verticalAlign: 'top' }}
            rowSpan={DAYS.length}
          >
            <TodoCell
              value={columnData.globalTodos || []}
              onChange={handleCellChange}
              column={{
                id: columnId,
                type: columnData.type || 'todo',
                ...columnData,
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
