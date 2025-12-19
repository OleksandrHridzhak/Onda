import React from 'react';
import { ColumnHeaderContent } from './ColumnHeaderContent';
import { TaskTableCell } from '../cells/TaskTableCell';
import { DAYS } from '../TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateColumnNested,
  updateCommonColumnProperties,
  swapColumnsPosition,
  deleteColumn,
} from '../../../store/tableSlice/tableSlice';

interface TaskTableColumnWrapperProps {
  columnId: string;
}

export const TaskTableColumnWrapper: React.FC<TaskTableColumnWrapperProps> = ({
  columnId,
}) => {
  const dispatch = useDispatch();
  const columnData: Record<string, any> = useSelector(
    (state: Record<string, any>) => state.tableData.columns[columnId] || {},
  );
  const columnOrder: string[] = useSelector(
    (state: Record<string, any>) => state.tableData?.columnOrder ?? [],
  );
  const allColumns = useSelector(
    (state: Record<string, any>) => state.tableData?.columns ?? {},
  );

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
          uniqueProperties: {
            ...columnData.uniqueProperties,
            Options: options,
            OptionsColors: tagColors,
            DoneTags: doneTags || [],
          },
        },
      }),
    );
  };

  const handleMoveColumn = (id: string, direction: string) => {
    const mappedDirection = direction === 'up' ? 'left' : 'right';
    dispatch(swapColumnsPosition({ id, direction: mappedDirection }));
  };

  const handleChangeWidth = (id: string, width: number) => {
    dispatch(
      updateCommonColumnProperties({
        columnId: id,
        properties: { Width: width },
      }),
    );
  };

  const columnMenuLogic = {
    handleDeleteColumn: (id: string) => {
      dispatch(deleteColumn({ columnId: id }));
    },
    handleClearColumn: () => {
      // Clear all options/tasks in the task table column
      dispatch(
        updateCommonColumnProperties({
          columnId,
          properties: {
            uniqueProperties: {
              ...columnData.uniqueProperties,
              Options: [],
              OptionsColors: {},
              DoneTags: [],
            },
          },
        }),
      );
    },
    handleRename: (id: string, newName: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { Name: newName },
        }),
      );
    },
    handleChangeIcon: (id: string, newIcon: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { EmojiIcon: newIcon },
        }),
      );
    },
    handleChangeDescription: (id: string, description: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { Description: description },
        }),
      );
    },
    handleToggleTitleVisibility: (id: string, visible: boolean) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { NameVisible: visible },
        }),
      );
    },
    handleChangeOptions: (
      id: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags?: string[],
    ) => {
      const targetColumn = allColumns[id];
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: {
            uniqueProperties: {
              ...targetColumn?.uniqueProperties,
              Options: options,
              OptionsColors: tagColors,
              DoneTags: doneTags || [],
            },
          },
        }),
      );
    },
    handleChangeCheckboxColor: (id: string, color: string) => {
      dispatch(
        updateColumnNested({
          columnId: id,
          path: ['CheckboxColor'],
          value: color,
        }),
      );
    },
  };

  // Build columns array for ColumnHeaderContent
  const columns = columnOrder.map((id) => ({
    id,
    ...allColumns[id],
    name: allColumns[id]?.Name,
    type: allColumns[id]?.Type?.toLowerCase(),
    emojiIcon: allColumns[id]?.EmojiIcon,
    nameVisible: allColumns[id]?.NameVisible,
  }));

  // Map column data properties for ColumnHeaderContent and ColumnMenu
  const columnForHeader = {
    id: columnId,
    ...columnData,
    name: columnData.Name,
    type: columnData.Type?.toLowerCase(),
    emojiIcon: columnData.EmojiIcon,
    nameVisible: columnData.NameVisible,
    width: columnData.Width,
    description: columnData.Description,
    options: columnData.uniqueProperties?.Options,
    tagColors: columnData.uniqueProperties?.OptionsColors,
    doneTags: columnData.uniqueProperties?.DoneTags,
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
                tagColors: columnData.uniqueProperties?.OptionsColors || {},
                options: columnData.uniqueProperties?.Options || [],
                doneTags: columnData.uniqueProperties?.DoneTags || [],
              }}
              onChangeOptions={handleChangeOptions}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
