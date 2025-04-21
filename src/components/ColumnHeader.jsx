import React, { useState } from "react";
import { Settings, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2 } from 'lucide-react';
import ColumnMenu from './ColumnMenu';

const columnWidths = {
    days: 'w-32',
    checkbox: 'w-12',
    numberbox: 'w-20',
    'multi-select': 'w-32',
    text: 'w-64'
};

const ColumnHeader = ({ column, onRemove, onRename, onChangeIcon, onChangeDescription, onToggleTitleVisibility, onChangeOptions, darkMode }) => {
  const [showMenu, setShowMenu] = useState(false);
  const widthClass = columnWidths[column.Type] || '';

  return (
    <th className={`font-poppins px-3 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'} border-b border-r whitespace-nowrap ${widthClass} overflow-hidden`}>
      <div
        className="flex items-center justify-between group cursor-pointer"
        onClick={() => column.ColumnId !== 'days' && setShowMenu(true)}
      >
        <div className="flex items-center" data-tooltip-id={`tooltip-${column.ColumnId}`}>
          {column.EmojiIcon && <span className="mr-1">{column.EmojiIcon}</span>}
          {column.NameVisible !== false && (
            <span className={`truncate block ${darkMode ? 'text-gray-200' : 'text-gray-600'} max-w-full`}>{column.Name}</span>
          )}
        </div>
        {column.ColumnId !== 'days' && (
          <div className="ml-2 opacity-0 group-hover:opacity-100 flex">
            <Menu className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        )}
        {column.Description && (
          <div
            className={`absolute z-10 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-gray-800 text-white'} text-xs rounded py-1 px-2 mb-20 min-w-48 max-w-72 whitespace-normal`}
            style={{ transition: 'opacity 0.2s' }}
          >
            {column.NameVisible === false ? `${column.Name}: ` : ''}{column.Description}
            <div className={`absolute left-2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 ${darkMode ? 'border-t-gray-800' : 'border-t-gray-800'}`}></div>
          </div>
        )}
        {showMenu && (
          <ColumnMenu
            column={column}
            onClose={() => setShowMenu(false)}
            onRename={onRename}
            onChangeIcon={onChangeIcon}
            handleDeleteColumn={onRemove}
            onChangeDescription={onChangeDescription}
            onToggleTitleVisibility={onToggleTitleVisibility}
            onChangeOptions={onChangeOptions}
            darkMode={darkMode}
          />
        )}
      </div>
    </th>
  );
};

export default ColumnHeader;