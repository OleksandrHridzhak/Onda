import React, { useState } from 'react';
import { getIconComponent } from '../utils/icons';
import ColumnMenu from './columnMenu/ColumnMenu';
import { useColumnContext } from './context/ColumnContext';

interface Column {
  id: string;
  name: string;
  type: string;
  emojiIcon?: string;
  nameVisible?: boolean;
  width?: number;
  description?: string;
  options?: string[];
  doneTags?: string[];
  tagColors?: Record<string, string>;
  checkboxColor?: string;
}

interface ColumnHeaderProps {
  column: Column;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  canMoveUp,
  canMoveDown,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  // Get operations from context instead of props
  const {
    handleRename,
    handleDeleteColumn,
    handleClearColumn,
    handleChangeIcon,
    handleChangeDescription,
    handleToggleTitleVisibility,
    handleChangeOptions,
    handleChangeCheckboxColor,
    handleMoveColumn,
    handleChangeWidth,
  } = useColumnContext();
  
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
            handleDeleteColumn={handleDeleteColumn}
            handleClearColumn={handleClearColumn}
            onRename={handleRename}
            onChangeIcon={handleChangeIcon}
            onChangeDescription={handleChangeDescription}
            onToggleTitleVisibility={handleToggleTitleVisibility}
            onChangeOptions={handleChangeOptions}
            onChangeCheckboxColor={handleChangeCheckboxColor}
            onMoveUp={(id: string) => handleMoveColumn(id, 'up')}
            onMoveDown={(id: string) => handleMoveColumn(id, 'down')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onChangeWidth={handleChangeWidth}
          />
        )}
      </div>
    </th>
  );
};

export default ColumnHeader;
