import React from 'react';
import { ColumnHeaderContent } from './ColumnHeaderContent';
import { TagsCell } from '../cells/TagsCell';
import { DAYS } from '../TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import { updateColumnNested, updateCommonColumnProperties, swapColumnsPosition, deleteColumn } from '../../../store/tableSlice/tableSlice';

interface TagsColumnWrapperProps {
  columnId: string;
}

export const TagsColumnWrapper: React.FC<TagsColumnWrapperProps> = ({
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

  const handleCellChange = (day: string, newValue: string) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['Values', day],
        value: newValue,
      })
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
      })
    );
  };

  const columnMenuLogic = {
    handleDeleteColumn: (id: string) => {
      dispatch(deleteColumn({ columnId: id }));
    },
    handleClearColumn: () => {
      // Clear all days in the tags column
      DAYS.forEach((day) => {
        dispatch(
          updateColumnNested({
            columnId,
            path: ['Values', day],
            value: '',
          })
        );
      });
    },
    handleRename: (id: string, newName: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { Name: newName },
        })
      );
    },
    handleChangeIcon: (id: string, newIcon: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { EmojiIcon: newIcon },
        })
      );
    },
    handleChangeDescription: (id: string, description: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { Description: description },
        })
      );
    },
    handleToggleTitleVisibility: (id: string, visible: boolean) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { NameVisible: visible },
        })
      );
    },
    handleChangeOptions: (
      id: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags?: string[]
    ) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { options, tagColors, doneTags },
        })
      );
    },
    handleChangeCheckboxColor: (id: string, color: string) => {
      dispatch(
        updateColumnNested({
          columnId: id,
          path: ['CheckboxColor'],
          value: color,
        })
      );
    },
  };

  // Build columns array for ColumnHeaderContent
  const columns = columnOrder.map((id) => ({
    id,
    ...allColumns[id],
  }));

  return (
    <table className="checkbox-nested-table font-poppins">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={{ id: columnId, ...columnData }}
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
              <TagsCell
                value={columnData.uniqueProperties?.Values?.[day] || ''}
                onChange={(newValue) => handleCellChange(day, newValue)}
                options={columnData.uniqueProperties?.options || []}
                tagColors={columnData.uniqueProperties?.tagColors || {}}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
