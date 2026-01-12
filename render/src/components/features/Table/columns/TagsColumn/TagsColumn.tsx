import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TagsCell } from './TagsCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import {
  updateColumnNested,
  updateCommonColumnProperties,
} from '../../../../../store/tableSlice/tableSlice';

interface TagsColumnProps {
  columnId: string;
}

export const TagsColumn: React.FC<TagsColumnProps> = ({ columnId }) => {
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
    clearValue: '',
    customHandleChangeOptions,
  });

  const handleCellChange = (day: string, newValue: string) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['days', day],
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
              <TagsCell
                value={columnData.days?.[day] || ''}
                onChange={(newValue) => handleCellChange(day, newValue)}
                options={columnData.options || []}
                tagColors={columnData.tagColors || {}}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
