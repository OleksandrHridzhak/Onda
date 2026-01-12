import React from 'react';
import ColumnMenu from './columnMenu/ColumnMenu';
import { useColumnLogic } from './columns/useColumnLogic';
import { updateCommonColumnProperties } from '../../../store/tableSlice/tableSlice';

interface MobileColumnMenuProps {
  columnId: string;
  onClose: () => void;
}

export const MobileColumnMenu: React.FC<MobileColumnMenuProps> = ({
  columnId,
  onClose,
}) => {
  const {
    columnData,
    dispatch,
    columnMenuLogic,
    handleMoveColumn,
    handleChangeWidth,
    columns,
    columnForHeader,
  } = useColumnLogic({ columnId });

  const handleChangeOptions = (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => {
    const type = columnForHeader.type || columnData.type?.toLowerCase();
    if (type === 'multiselect') {
      dispatch(
        // Tags use Tags / TagsColors
        // preserve other uniqueProperties keys
        updateCommonColumnProperties({
          columnId: id,
          properties: {
            uniqueProperties: {
              ...columnData.uniqueProperties,
              Tags: options,
              TagsColors: tagColors,
            },
          },
        }),
      );
    } else if (type === 'todo') {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: {
            uniqueProperties: {
              ...columnData.uniqueProperties,
              Categorys: options,
              CategoryColors: tagColors,
            },
          },
        }),
      );
    } else {
      // default: Options / OptionsColors / DoneTags
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
    }
  };

  return (
    <ColumnMenu
      column={columnForHeader as any}
      onClose={onClose}
      handleDeleteColumn={columnMenuLogic.handleDeleteColumn}
      handleClearColumn={columnMenuLogic.handleClearColumn}
      onRename={columnMenuLogic.handleRename}
      onChangeIcon={columnMenuLogic.handleChangeIcon}
      onChangeDescription={columnMenuLogic.handleChangeDescription}
      onToggleTitleVisibility={columnMenuLogic.handleToggleTitleVisibility}
      onChangeOptions={handleChangeOptions}
      onMoveUp={(id: string) => handleMoveColumn(id, 'up')}
      onMoveDown={(id: string) => handleMoveColumn(id, 'down')}
      canMoveUp={columns.findIndex((c) => c.id === columnId) > 1}
      canMoveDown={
        columns.findIndex((c) => c.id === columnId) < columns.length - 1
      }
      onChangeWidth={handleChangeWidth}
      onChangeCheckboxColor={columnMenuLogic.handleChangeCheckboxColor}
    />
  );
};
