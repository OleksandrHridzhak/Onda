import React from 'react';
import { ColumnHeaderContent } from './ColumnHeaderContent';
import { CheckboxCell } from '../cells/CheckboxCell';
import { DAYS } from '../TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateColumnNested,
  updateCommonColumnProperties,
  swapColumnsPosition,
  deleteColumn,
} from '../../../store/tableSlice/tableSlice';

interface CheckboxColumnProps {
  columnId: string;
}

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({
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

  const handleCheckboxChange = (day: string, newValue: boolean) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['Days', day],
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
      // Clear all days in the checkbox column
      DAYS.forEach((day) => {
        dispatch(
          updateColumnNested({
            columnId,
            path: ['Days', day],
            value: false,
          }),
        );
      });
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
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { options, tagColors, doneTags },
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
    checkboxColor: columnData.uniqueProperties?.CheckboxColor,
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
            <td>
              <CheckboxCell
                checked={columnData.uniqueProperties?.Days?.[day] || false}
                onChange={(newValue) => handleCheckboxChange(day, newValue)}
                color={columnData.uniqueProperties?.CheckboxColor || '#3b82f6'}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
