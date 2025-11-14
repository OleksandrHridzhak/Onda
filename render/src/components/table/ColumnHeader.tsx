import React, { useState } from 'react';
import { getIconComponent } from '../utils/icons';
import ColumnMenu from './columnMenu/ColumnMenu';

interface Column {
  id: string;
  name: string;
  emojiIcon?: string;
  nameVisible?: boolean;
  width?: number;
  description?: string;
  type?: string;
}

interface ColumnHeaderProps {
  column: Column;
  onRemove: (id: string) => void;
  onClearColumn: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onChangeIcon: (id: string, newIcon: string) => void;
  onChangeDescription: (id: string, newDescription: string) => void;
  onToggleTitleVisibility: (id: string) => void;
  onChangeOptions: (id: string, options: unknown) => void;
  onChangeCheckboxColor: (id: string, color: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChangeWidth: (id: string, width: number) => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  onRemove,
  onClearColumn,
  onRename,
  onChangeIcon,
  onChangeDescription,
  onToggleTitleVisibility,
  onChangeOptions,
  onChangeCheckboxColor,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onChangeWidth,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const style = column.width ? { width: `${column.width}px` } : {};
  const isEmptyHeader =
    !column.emojiIcon && (column.nameVisible === false || !column.name);

  const handleClose = (): void => {
    console.log('Menu closed');
    setShowMenu(false);
  };

  return (
    <th
      data-column-id={column.id}
      className={`font-poppins px-3 py-3 text-left text-sm font-medium bg-tableHeader border-border text-textTableValues border-b border-r whitespace-nowrap overflow-hidden`}
      style={
        column.id === 'days'
          ? { width: '120px', minWidth: '120px', maxWidth: '120px' }
          : style
      }
    >
      <div
        className={`flex items-center justify-between group cursor-pointer ${column.nameVisible === false || isEmptyHeader ? 'justify-center' : ''}`}
        onClick={() => column.id !== 'days' && setShowMenu(true)}
      >
        <div
          className={`flex items-center ${column.nameVisible === false || isEmptyHeader ? 'justify-center w-full' : ''}`}
          data-tooltip-id={`tooltip-${column.id}`}
        >
          {column.emojiIcon && (
            <span className={column.nameVisible !== false ? 'mr-1' : ''}>
              {getIconComponent(column.emojiIcon, 16)}
            </span>
          )}
          {column.nameVisible !== false && column.name && (
            <span
              className={`truncate block text-textTableValues max-w-full`}
            >
              {column.name}
            </span>
          )}
          {isEmptyHeader && <span className="opacity-0">∅</span>}
        </div>
        {showMenu && (
          <ColumnMenu
            column={column}
            onClose={handleClose}
            handleDeleteColumn={onRemove}
            handleClearColumn={onClearColumn}
            onRename={onRename}
            onChangeIcon={onChangeIcon}
            onChangeDescription={onChangeDescription}
            onToggleTitleVisibility={onToggleTitleVisibility}
            onChangeOptions={onChangeOptions}
            onChangeCheckboxColor={onChangeCheckboxColor}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onChangeWidth={onChangeWidth}
          />
        )}
      </div>
    </th>
  );
};

export default ColumnHeader;
