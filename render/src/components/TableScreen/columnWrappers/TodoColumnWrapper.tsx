import React from 'react';
import { ColumnHeaderContent } from './ColumnHeaderContent';
import { TodoCell } from '../cells/TodoCell';
import { DAYS } from '../TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateColumnNested,
  updateCommonColumnProperties,
  swapColumnsPosition,
  deleteColumn,
} from '../../../store/tableSlice/tableSlice';

interface TodoColumnWrapperProps {
  columnId: string;
}

export const TodoColumnWrapper: React.FC<TodoColumnWrapperProps> = ({
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

  const handleCellChange = (newValue: any) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['Chosen', 'global'],
        value: newValue,
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
      // Clear all tasks in the todo column
      dispatch(
        updateColumnNested({
          columnId,
          path: ['Chosen', 'global'],
          value: [],
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
              Categorys: options,
              CategoryColors: tagColors,
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
    options: columnData.uniqueProperties?.Categorys,
    tagColors: columnData.uniqueProperties?.CategoryColors,
    Chosen: columnData.uniqueProperties?.Chosen,
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
              value={columnData.uniqueProperties?.Chosen?.global || []}
              onChange={handleCellChange}
              column={{
                id: columnId,
                type: columnData.Type || 'todo',
                ...columnData,
                options:
                  columnData.uniqueProperties?.Categorys || columnData.options,
                tagColors:
                  columnData.uniqueProperties?.CategoryColors ||
                  columnData.tagColors,
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
