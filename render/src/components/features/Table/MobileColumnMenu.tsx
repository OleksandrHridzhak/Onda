import React, { useCallback } from 'react';
import ColumnMenu from './columnMenu/ColumnMenu';
import { useColumnLogic } from './columns/useColumnLogic';
import { useColumns } from '../../../database';

interface MobileColumnMenuProps {
  columnId: string;
  onClose: () => void;
}

export const MobileColumnMenu: React.FC<MobileColumnMenuProps> = ({
  columnId,
  onClose,
}) => {
  const { updateColumnNested: updateNested } = useColumns();

  const {
    columnData,
    columnMenuLogic,
    handleMoveColumn,
    handleChangeWidth,
    columns,
    columnForHeader: baseColumnForHeader,
  } = useColumnLogic({ columnId });

  const uniqueProps =
    (columnData.uniqueProperties as Record<string, unknown>) || {};

  const columnForHeader = {
    id: baseColumnForHeader.id,
    name: baseColumnForHeader.name,
    type: baseColumnForHeader.type,
    emojiIcon: baseColumnForHeader.emojiIcon,
    nameVisible: baseColumnForHeader.nameVisible,
    width: baseColumnForHeader.width,
    description: baseColumnForHeader.description,
    checkboxColor: baseColumnForHeader.checkboxColor as string | undefined,
    // include Categorys for todo columns, fallback to Options/Tags for others
    options: (uniqueProps.Categorys ||
      uniqueProps.Options ||
      uniqueProps.Tags ||
      []) as string[],
    tagColors: (uniqueProps.CategoryColors ||
      uniqueProps.OptionsColors ||
      uniqueProps.TagsColors ||
      {}) as Record<string, string>,
    doneTags: (uniqueProps.DoneTags || []) as string[],
  };

  const handleChangeOptions = useCallback(
    (
      id: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags?: string[],
    ) => {
      const columnType =
        baseColumnForHeader.type?.toLowerCase() ||
        columnData.type?.toLowerCase();
      if (columnType === 'multiselect') {
        // Tags use Tags / TagsColors
        updateNested(id, ['Tags'], options);
        updateNested(id, ['TagsColors'], tagColors);
      } else if (columnType === 'todo') {
        updateNested(id, ['Categorys'], options);
        updateNested(id, ['CategoryColors'], tagColors);
      } else {
        // default: Options / OptionsColors / DoneTags
        updateNested(id, ['Options'], options);
        updateNested(id, ['OptionsColors'], tagColors);
        updateNested(id, ['DoneTags'], doneTags || []);
      }
    },
    [baseColumnForHeader.type, columnData.type, updateNested],
  );

  return (
    <ColumnMenu
      column={columnForHeader}
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
