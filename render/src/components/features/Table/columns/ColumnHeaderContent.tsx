import React, { useState } from 'react';
import ColumnMenu from '../columnMenu/ColumnMenu';
import { getIconComponent } from '../../../../utils/icons';

interface ColumnHeaderContentProps {
  column: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}

export const ColumnHeaderContent: React.FC<ColumnHeaderContentProps> = ({
  column,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isEmptyHeader =
    !column.emojiIcon && (column.nameVisible === false || !column.name);

  const handleClose = (): void => {
    setShowMenu(false);
  };

  return (
    <div
      role="button"
      tabIndex={column.id !== 'days' ? 0 : -1}
      className={`font-poppins flex items-center justify-between group cursor-pointer px-3 py-3 text-left text-sm font-medium ${column.nameVisible === false || isEmptyHeader ? 'justify-center' : ''}`}
      onClick={() => column.id !== 'days' && setShowMenu(true)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && column.id !== 'days') {
          e.preventDefault();
          setShowMenu(true);
        }
      }}
      aria-label={column.name || 'Column settings'}
    >
      <div
        className={`flex items-center ${column.nameVisible === false || isEmptyHeader ? 'justify-center w-full' : ''}`}
      >
        {column.emojiIcon && (
          <span className={column.nameVisible !== false ? 'mr-1' : ''}>
            {getIconComponent(column.emojiIcon, 16)}
          </span>
        )}
        {column.nameVisible !== false && column.name && (
          <span className={`truncate block text-textTableValues max-w-full`}>
            {column.name}
          </span>
        )}
        {isEmptyHeader && <span className="opacity-0">∅</span>}
      </div>
      {showMenu && (
        <ColumnMenu
          column={column}
          onClose={handleClose}
          handleDeleteColumn={columnMenuLogic.handleDeleteColumn}
          handleClearColumn={columnMenuLogic.handleClearColumn}
          onRename={columnMenuLogic.handleRename}
          onChangeIcon={columnMenuLogic.handleChangeIcon}
          onChangeDescription={columnMenuLogic.handleChangeDescription}
          onToggleTitleVisibility={(id: string, visible: boolean) =>
            columnMenuLogic.handleToggleTitleVisibility(id, visible)
          }
          onChangeOptions={(
            id: string,
            options: string[],
            tagColors: Record<string, string>,
            doneTags?: string[],
          ) =>
            columnMenuLogic.handleChangeOptions(
              id,
              options,
              tagColors,
              doneTags,
            )
          }
          onChangeCheckboxColor={columnMenuLogic.handleChangeCheckboxColor}
          onMoveUp={(id: string) => handleMoveColumn(id, 'up')}
          onMoveDown={(id: string) => handleMoveColumn(id, 'down')}
          canMoveUp={column.id !== 'days' && columns.indexOf(column) > 1}
          canMoveDown={
            column.id !== 'days' && columns.indexOf(column) < columns.length - 1
          }
          onChangeWidth={handleChangeWidth}
        />
      )}
    </div>
  );
};
