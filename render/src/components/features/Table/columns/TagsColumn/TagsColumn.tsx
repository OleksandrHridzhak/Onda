import React, { useCallback } from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TagsCell } from './TagsCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { useColumns } from '../../../../../database';

interface TagsColumnProps {
  columnId: string;
}

export const TagsColumn: React.FC<TagsColumnProps> = ({ columnId }) => {
  const { updateColumnNested: updateNested } = useColumns();

  const customHandleChangeOptions = useCallback(
    (id: string, options: string[], tagColors: Record<string, string>) => {
      updateNested(id, ['Tags'], options);
      updateNested(id, ['TagsColors'], tagColors);
    },
    [updateNested],
  );

  const {
    columnData,
    updateColumnNested,
    handleMoveColumn,
    handleChangeWidth,
    columnMenuLogic,
    columns,
    columnForHeader: baseColumnForHeader,
  } = useColumnLogic({
    columnId,
    clearValue: '',
    customHandleChangeOptions,
  });

  const handleCellChange = (day: string, newValue: string) => {
    updateColumnNested(['Days', day], newValue);
  };

  const uniqueProps =
    (columnData.uniqueProperties as Record<string, unknown>) || {};

  const columnForHeader = {
    ...baseColumnForHeader,
    options: uniqueProps.Tags,
    tagColors: uniqueProps.TagsColors,
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
                value={
                  (uniqueProps.Days as Record<string, string>)?.[day] || ''
                }
                onChange={(newValue) => handleCellChange(day, newValue)}
                options={(uniqueProps.Tags as string[]) || []}
                tagColors={
                  (uniqueProps.TagsColors as Record<string, string>) || {}
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
