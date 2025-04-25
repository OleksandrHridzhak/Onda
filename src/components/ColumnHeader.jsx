import React, { useState } from "react";
import { Menu, ArrowUp, ArrowDown } from 'lucide-react';
import ColumnMenu from './ColumnMenu';

import {
  Heart, Star, Zap, Sun, Moon, 
  Coffee, Rocket, Shield, Flag, Bell,
  Book, Music, Pizza, Gamepad,
  Camera, Clock, Globe, Lock, Map,
  Mic, Pen, Phone, Search, User,BicepsFlexed
} from 'lucide-react';

const iconComponents = {
  Heart: <Heart size={16} />,
  Star: <Star size={16} />,
  Zap: <Zap size={16} />,
  Sun: <Sun size={16} />,
  Moon: <Moon size={16} />,
  Coffee: <Coffee size={16} />,
  Rocket: <Rocket size={16} />,
  Shield: <Shield size={16} />,
  Flag: <Flag size={16} />,
  Bell: <Bell size={16} />,
  Book: <Book size={16} />,
  Music: <Music size={16} />,
  Pizza: <Pizza size={16} />,
  Gamepad: <Gamepad size={16} />,
  Camera: <Camera size={16} />,
  Clock: <Clock size={16} />,
  Globe: <Globe size={16} />,
  Lock: <Lock size={16} />,
  Map: <Map size={16} />,
  Mic: <Mic size={16} />,
  Pen: <Pen size={16} />,
  Phone: <Phone size={16} />,
  Search: <Search size={16} />,
  User: <User size={16} />,
  BicepsFlexed: <BicepsFlexed size={16} />
};

const ColumnHeader = ({
  column,
  onRemove,
  onRename,
  onChangeIcon,
  onChangeDescription,
  onToggleTitleVisibility,
  onChangeOptions,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  darkMode,
  columnWidths,
  onChangeWidth
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const style = column.Width ? { width: `${column.Width}px` } : {};

  const getIconComponent = (iconName) => {
    return iconComponents[iconName] || null;
  };

  // Перевіряємо, чи заголовок порожній (немає ні іконки, ні тексту)
  const isEmptyHeader = !column.EmojiIcon && (column.NameVisible === false || !column.Name);

  return (
    <th 
      data-column-id={column.ColumnId}
      className={`font-poppins px-3 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'} border-b border-r whitespace-nowrap overflow-hidden`}
      style={column.ColumnId === 'days' ? { width: '120px', minWidth: '120px', maxWidth: '120px' } : style}
    >
      <div
        className={`flex items-center justify-between group cursor-pointer ${column.NameVisible === false || isEmptyHeader ? 'justify-center' : ''}`}
        onClick={() => column.ColumnId !== 'days' && setShowMenu(true)}
      >
        <div className={`flex items-center ${column.NameVisible === false || isEmptyHeader ? 'justify-center w-full' : ''}`} data-tooltip-id={`tooltip-${column.ColumnId}`}>
          {column.EmojiIcon && (
            <span className={column.NameVisible !== false ? "mr-1" : ""}>
              {getIconComponent(column.EmojiIcon)}
            </span>
          )}
          {column.NameVisible !== false && column.Name && (
            <span className={`truncate block ${darkMode ? 'text-gray-200' : 'text-gray-600'} max-w-full`}>
              {column.Name}
            </span>
          )}
          {/* Додаємо невидимий елемент для порожніх заголовків, щоб вони займали місце */}
          {isEmptyHeader && <span className="opacity-0">∅</span>}
        </div>
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