import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TaskTableCell } from './TaskTableCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { updateCommonColumnProperties } from '../../../../../store/tableSlice/tableSlice';

interface TaskTableColumnProps {
  columnId: string;
}

export const TaskTableColumn: React.FC<TaskTableColumnProps> = ({
  columnId,
}) => {
  const customClearColumn = () => {
    dispatch(
      updateCommonColumnProperties({
        columnId,
        properties: {
          tasks: [],
          tagColors: {},
          doneTags: [],
        },
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
          tagColors,
          doneTags: doneTags || [],
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

  const handleChangeOptions = (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => {
    dispatch(
      updateCommonColumnProperties({
        columnId: id,
        properties: {
          tagColors,
          doneTags: doneTags || [],
        },
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
            <TaskTableCell
              column={{
                id: columnId,
                ...columnData,
              }}
              onChangeOptions={handleChangeOptions}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
