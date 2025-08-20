import { useState } from 'react';
import { getIconComponent } from './utils/icons';
import ColumnMenu from './ColumnMenu';

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
  darkMode,
  onChangeWidth
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const style = column.Width ? { width: `${column.Width}px` } : {};

  const isEmptyHeader = !column.EmojiIcon && (column.NameVisible === false || !column.Name);
  const handleClose = () => {
    console.log('Menu closed');
    setShowMenu(false);
  };

  return (
    <th 
      data-column-id={column.ColumnId}
      className={`font-poppins px-3 py-3 text-left text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'} border-b border-r whitespace-nowrap overflow-hidden`}
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
            <span className={`truncate block ${darkMode ? 'text-gray-200' : 'text-gray-600'} max-w-full`}>
              {column.Name}
            </span>
          )}
          {isEmptyHeader && <span className="opacity-0">∅</span>}
        </div>
        {column.Description && (
          <div
            className={`absolute z-10 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-gray-800 text-white'} text-xs rounded py-1 px-2 mb-20 min-w-48 max-w-72 whitespace-normal`}
            style={{ transition: 'opacity 0.2s', transitionDelay: '0.3s' }}
          >
            {column.NameVisible === false ? `${column.Name}: ` : ''}{column.Description}
            <div className={`absolute left-2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 ${darkMode ? 'border-t-gray-800' : 'border-t-gray-800'}`}></div>
          </div>
        )}
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
            darkMode={darkMode}
            onChangeWidth={onChangeWidth}
          />
        )}
      </div>
    </th>
  );
};

export default ColumnHeader;