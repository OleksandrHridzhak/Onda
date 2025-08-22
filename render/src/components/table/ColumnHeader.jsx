import { useState } from 'react';
import { getIconComponent } from '../utils/icons';
import ColumnMenu from './columnMenu/ColumnMenu';
import { useSelector } from 'react-redux';

const ColumnHeader = ({
  column,
  onRemove,
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
  onChangeWidth
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const style = column.Width ? { width: `${column.Width}px` } : {};
  const {theme} = useSelector((state) => state.theme);
  const isEmptyHeader = !column.EmojiIcon && (column.NameVisible === false || !column.Name);
  const handleClose = () => {
    console.log('Menu closed');
    setShowMenu(false);
  };

  return (
    <th 
      data-column-id={column.ColumnId}
      className={`font-poppins px-3 py-3 text-left text-sm font-medium ${theme.tableHeader} ${theme.border} ${theme.textTableValues} border-b border-r whitespace-nowrap overflow-hidden`}
      style={column.ColumnId === 'days' ? { width: '120px', minWidth: '120px', maxWidth: '120px' } : style}
    >
      <div
        className={`flex items-center justify-between group cursor-pointer ${column.NameVisible === false || isEmptyHeader ? 'justify-center' : ''}`}
        onClick={() => column.ColumnId !== 'days' && setShowMenu(true)}
      >
        <div className={`flex items-center ${column.NameVisible === false || isEmptyHeader ? 'justify-center w-full' : ''}`} data-tooltip-id={`tooltip-${column.ColumnId}`}>
          {column.EmojiIcon && (
            <span className={column.NameVisible !== false ? "mr-1" : ""}>
              {getIconComponent(column.EmojiIcon, 16)}
            </span>
          )}
          {column.NameVisible !== false && column.Name && (
            <span className={`truncate block ${theme.textTableValues} max-w-full`}>
              {column.Name}
            </span>
          )}
          {isEmptyHeader && <span className="opacity-0">∅</span>}
        </div>
        {showMenu && (
          <ColumnMenu
            column={column}
            onClose={handleClose}
            handleDeleteColumn={onRemove}
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