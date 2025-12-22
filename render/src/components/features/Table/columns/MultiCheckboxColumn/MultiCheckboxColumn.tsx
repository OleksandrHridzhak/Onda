import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { MultiCheckboxCell } from './MultiCheckboxCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import {
  updateColumnNested,
  updateCommonColumnProperties,
} from '../../../../../store/tableSlice/tableSlice';

interface MultiCheckboxColumnProps {
  columnId: string;
}

export const MultiCheckboxColumn: React.FC<MultiCheckboxColumnProps> = ({
  columnId,
}) => {
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
          uniqueProperties: {
            ...columnData?.uniqueProperties,
            Options: options,
            OptionsColors: tagColors,
          },
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
    columnForHeader: baseColumnForHeader,
  } = useColumnLogic({
    columnId,
    clearValue: '',
    customHandleChangeOptions,
  });

  const handleCellChange = (day: string, newValue: string) => {
    dispatch(
      updateColumnNested({
        columnId,
        path: ['Days', day],
        value: newValue,
      }),
    );
  };

  const columnForHeader = {
    ...baseColumnForHeader,
    options: columnData.uniqueProperties?.Options,
    tagColors: columnData.uniqueProperties?.OptionsColors,
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
              <MultiCheckboxCell
                value={columnData.uniqueProperties?.Days?.[day] || ''}
                onChange={(newValue) => handleCellChange(day, newValue)}
                options={columnData.uniqueProperties?.Options || []}
                tagColors={columnData.uniqueProperties?.OptionsColors || {}}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
