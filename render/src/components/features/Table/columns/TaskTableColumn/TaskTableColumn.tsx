import React, { useCallback } from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TaskTableCell } from './TaskTableCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { useColumns } from '../../../../../database';

interface TaskTableColumnProps {
  columnId: string;
}

export const TaskTableColumn: React.FC<TaskTableColumnProps> = ({
  columnId,
}) => {
  const { updateColumnNested: updateNested } = useColumns();

  const customClearColumn = useCallback(() => {
    updateNested(columnId, ['Options'], []);
    updateNested(columnId, ['OptionsColors'], {});
    updateNested(columnId, ['DoneTags'], []);
  }, [columnId, updateNested]);

  const customHandleChangeOptions = useCallback(
    (
      id: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags?: string[],
    ) => {
      updateNested(id, ['Options'], options);
      updateNested(id, ['OptionsColors'], tagColors);
      updateNested(id, ['DoneTags'], doneTags || []);
    },
    [updateNested],
  );

  const {
    columnData,
    handleMoveColumn,
    handleChangeWidth,
    columnMenuLogic,
    columns,
    columnForHeader: baseColumnForHeader,
  } = useColumnLogic({
    columnId,
    customClearColumn,
    customHandleChangeOptions,
  });

  const handleChangeOptions = useCallback(
    (
      id: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags?: string[],
    ) => {
      updateNested(id, ['Options'], options);
      updateNested(id, ['OptionsColors'], tagColors);
      updateNested(id, ['DoneTags'], doneTags || []);
    },
    [updateNested],
  );

  const uniqueProps =
    (columnData.uniqueProperties as Record<string, unknown>) || {};

  const columnForHeader = {
    ...baseColumnForHeader,
    options: uniqueProps.Options,
    tagColors: uniqueProps.OptionsColors,
    doneTags: uniqueProps.DoneTags,
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
                tagColors:
                  (uniqueProps.OptionsColors as Record<string, string>) || {},
                options: (uniqueProps.Options as string[]) || [],
                doneTags: (uniqueProps.DoneTags as string[]) || [],
              }}
              onChangeOptions={handleChangeOptions}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
