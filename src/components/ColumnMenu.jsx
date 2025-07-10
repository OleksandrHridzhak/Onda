import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, ArrowUp,ArrowRight,ArrowLeft, ArrowDown, Edit2,ChevronRight, ChevronLeft } from 'lucide-react';
  import { debounce } from 'lodash';
import { icons, getIconComponent } from './utils/icons';
import { getColorOptions } from './utils/colorOptions';
import { InputText } from './atoms/InputText';
import { BubbleBtn } from './atoms/BubbleBtn';
import { TransparentBtn } from './atoms/TransparentBtn';

const ColumnNameInput = ({ name, setName, darkMode,showTitle,setShowTitle }) => {
  return (
    <div className="w-full flex relative">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`w-full h-[50px] px-4 py-2 border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200`}
        placeholder='Column name'
      />
      <TitleVisibilityToggle showTitle={showTitle} setShowTitle={setShowTitle} darkMode={darkMode} />
    </div>
  );
};
const IconSelector = ({
  selectedIcon,
  setSelectedIcon,
  isIconSectionExpanded,
  setIsIconSectionExpanded,
  icons,
  darkMode,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsIconSectionExpanded(false);
      }
    };
    if (isIconSectionExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isIconSectionExpanded, setIsIconSectionExpanded]);

  const iconSizePx = 50; 
  const gapPx = 4;
  const maxIconsInRow = 7;
  const containerMaxWidth = maxIconsInRow * (iconSizePx + gapPx);

  return (
    <div className="relative mb-4" ref={ref}>
      <button
        onClick={() => setIsIconSectionExpanded(!isIconSectionExpanded)}
        className={`w-12 h-12 flex items-center justify-center rounded-xl border ${
        darkMode ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800' : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}

        aria-expanded={isIconSectionExpanded}
        aria-label="Select icon"
      >
        {selectedIcon ? getIconComponent(selectedIcon, 24) : <span className="text-sm">Select</span>}
      </button>

      {isIconSectionExpanded && (
        <div
          className={`absolute top-full w-96 left-0 mt-1 z-50 overflow-y-auto border rounded-lg shadow-lg
            ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}
            flex flex-wrap gap-1
          `}
        >
          {icons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => {
                setSelectedIcon(icon.name);
                setIsIconSectionExpanded(false);
              }}
              className={`flex items-center justify-center rounded-lg
                ${
                  selectedIcon === icon.name
                    ? darkMode
                      ? 'bg-gray-700 text-gray-100'
                      : 'bg-gray-100 text-gray-900'
                    : darkMode
                    ? 'text-gray-100 hover:bg-gray-700'
                    : 'text-gray-800 hover:bg-gray-100'
                } transition-colors duration-200`}
              aria-label={`Select ${icon.name} icon`}
              type="button"
              style={{ width: `${iconSizePx}px`, height: `${iconSizePx}px` }}
            >
              {getIconComponent(icon.name, 24)}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
const DescriptionInput = ({ description, setDescription, darkMode }) => {
  return (
    <div className="">
      <textarea
        value={description}
        placeholder='Description'
        onChange={(e) => setDescription(e.target.value)}
        className={`w-full px-4 py-2 border ${
          darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-900'
        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 resize-none`}
        rows="3"
      />
    </div>
  );
};



const TitleVisibilityToggle = ({ showTitle, setShowTitle, darkMode }) => (
  <div className="flex items-center h-12 w-12 justify-center absolute right-0 top-0">
    <button
      onClick={() => setShowTitle(!showTitle)}
      className={`flex items-center space-x-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-200`}
      aria-label={showTitle ? 'Hide column title' : 'Show column title'}
    >
      {showTitle ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  </div>
);

export const ColumnWidthInput = ({ width, handleWidthChange, darkMode }) => (
  <div className="w-full">
    <input
      type="number"
      value={width}
      onChange={handleWidthChange}
      min="0"
      max="1000"
      className={`w-full px-3 py-2.5 flex items-center text-sm border ${
        darkMode
          ? "bg-transparent  border-gray-700 text-gray-200 hover:text-white"
          : "bg-transparent   border-gray-300 text-gray-900"
      } rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600`}
      placeholder="Enter width in pixels"
      aria-label="Column width"
    />
  </div>
);

const ColumnPositionControls = ({ onMoveUp, onMoveDown, canMoveUp, canMoveDown, darkMode, width, handleWidthChange }) => (
  <div className="mb-4">
    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>Column Position and width</label>
    <div className="flex space-x-2">
      <ColumnWidthInput width={width} handleWidthChange={handleWidthChange} darkMode={darkMode} />
      <TransparentBtn 
        onClick={onMoveUp}
        disabled={!canMoveUp}
        darkTheme={darkMode}
      >
        <ArrowLeft size={18} /> LEFT
      </TransparentBtn>
      <TransparentBtn 
        onClick={onMoveDown}
        disabled={!canMoveDown}
        darkTheme={darkMode}
      >
        RIGHT <ArrowRight size={18} />
      </TransparentBtn>
    </div>
  </div>
);

const OptionItem = ({ option, options, doneTags, optionColors, darkMode, handleColorChange, handleRemoveOption, handleEditOption }) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [editValue, setEditValue] = useState('');
  const menuRef = useRef(null);

  const startEditing = () => {
    setEditingOption(option);
    setEditValue(option);
  };

  const saveEdit = () => {
    if (editValue.trim() && !options.includes(editValue.trim()) && !doneTags.includes(editValue.trim())) {
      handleEditOption(option, editValue.trim());
    }
    setEditingOption(null);
    setEditValue('');
    setIsContextMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsContextMenuOpen(false);
      }
    };

    if (isContextMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContextMenuOpen]);

  return (
    <div key={option} className="relative">
      {editingOption === option ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
            className={`px-2 py-1 rounded-full text-xs font-medium border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            aria-label={`Edit ${option}`}
          />
          <button
            onClick={saveEdit}
            className={`ml-2 p-1 rounded-lg ${darkMode ? 'text-indigo-400 hover:bg-gray-700' : 'text-indigo-500 hover:bg-gray-100'} transition-colors duration-200`}
            aria-label={`Save edit for ${option}`}
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getColorOptions({ darkMode }).find(c => c.name === optionColors[option])?.bg} ${getColorOptions({ darkMode }).find(c => c.name === optionColors[option])?.text || (darkMode ? 'text-gray-200' : 'text-gray-800')}`}
            aria-label={`Options for ${option}`}
          >
            {option} {doneTags.includes(option) && '(Completed)'}
          </button>
          {isContextMenuOpen && (
            <div
              ref={menuRef}
              className={`absolute left-0 top-full mt-1 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-2 z-10`}
            >
              <div className="flex items-center space-x-2 p-2 overflow-x-auto max-w-xs">
                {getColorOptions({ darkMode }).map(color => (
                  <button
                    key={color.name}
                    onClick={() => {
                      handleColorChange(option, color.name);
                      setIsContextMenuOpen(false);
                    }}
                    className={`w-6 h-6 rounded-full ${color.bg} ${color.text || (darkMode ? 'text-gray-200' : 'text-gray-800')} border-2 ${optionColors[option] === color.name ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-transparent'} hover:scale-110 hover:shadow-md transition-all duration-200`}
                    aria-label={`Select ${color.name} color for ${option}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => {
                    startEditing();
                    setIsContextMenuOpen(false);
                  }}
                  className={`p-1 rounded-lg ${darkMode ? 'text-indigo-400 hover:bg-gray-700' : 'text-indigo-500 hover:bg-gray-100'} transition-colors duration-200`}
                  aria-label={`Edit ${option}`}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    handleRemoveOption(option);
                    setIsContextMenuOpen(false);
                  }}
                  className={`p-1 rounded-lg ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-100'} transition-colors duration-200`}
                  aria-label={`Remove ${option}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Updated OptionsList component
const OptionsList = ({ columnType, options, doneTags, newOption, setNewOption, handleAddOption, handleRemoveOption, handleEditOption, handleColorChange, optionColors, darkMode, toggleColorMenu }) => {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
        {columnType === 'tasktable' ? 'Tasks' : columnType === 'multi-select' ? 'Tags' : columnType === 'todo' ? 'Categories' : 'Checkboxes'}
      </label>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
            placeholder={`Add new ${columnType === 'multicheckbox' ? 'checkbox' : 'option'}...`}
            className={`flex-1 px-4 py-2 h-9 border ${
              darkMode 
                ? 'border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200`}
            aria-label={`Add new ${columnType}`}
          />
          <button
            onClick={handleAddOption}
            className={`flex items-center justify-center w-9 h-9 rounded-xl ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-blue-100' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
            }`}
            aria-label="Add new option"
          >
            <Plus size={18} className="stroke-2" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {[...options, ...doneTags].map((option) => (
            <OptionItem
              key={option}
              option={option}
              options={options}
              doneTags={doneTags}
              optionColors={optionColors}
              darkMode={darkMode}
              handleColorChange={handleColorChange}
              handleRemoveOption={handleRemoveOption}
              handleEditOption={handleEditOption}
              toggleColorMenu={toggleColorMenu}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
const CheckboxColorPicker = ({ checkboxColor, setCheckboxColor, darkMode, isColorMenuOpen, toggleColorMenu }) => (
  <div className="mb-4">
    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Checkbox Color</label>
    <div className="relative">
      <button
        onClick={toggleColorMenu}
        className={`w-6 h-6 rounded-full ${getColorOptions({ darkMode }).find(c => c.name === checkboxColor)?.bg} ${getColorOptions({ darkMode }).find(c => c.name === checkboxColor)?.text} border ${darkMode ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        aria-label="Select checkbox color"
      />
      {isColorMenuOpen && (
        <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} border rounded-lg shadow-md p-2 z-10`}>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {getColorOptions({ darkMode }).map(color => (
              <button
                key={color.name}
                onClick={() => {
                  setCheckboxColor(color.name);
                  toggleColorMenu();
                }}
                className={`w-6 h-6 rounded-full ${color.bg} ${color.text || (darkMode ? 'text-gray-200' : 'text-gray-800')} border ${checkboxColor === color.name ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border-transparent'} hover:ring-1 hover:ring-gray-400 transition-all duration-200`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const ColumnMenu = ({
  column,
  handleDeleteColumn,
  onClose,
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
  onChangeWidth,
  onChangeCheckboxColor = () => {},
}) => {
  const [name, setName] = useState(column.Name);
  const [selectedIcon, setSelectedIcon] = useState(column.EmojiIcon || '');
  const [description, setDescription] = useState(column.Description || '');
  const [showTitle, setShowTitle] = useState(column.NameVisible !== false);
  const [options, setOptions] = useState(column.Options || []);
  const [doneTags, setDoneTags] = useState(column.DoneTags || []);
  const [optionColors, setOptionColors] = useState(column.TagColors || {});
  const [checkboxColor, setCheckboxColor] = useState(column.CheckboxColor || 'green');
  const [newOption, setNewOption] = useState('');
  const [width, setWidth] = useState(column.Width ? parseInt(column.Width) : '');
  const [isIconSectionExpanded, setIsIconSectionExpanded] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setName(column.Name);
    setSelectedIcon(column.EmojiIcon || '');
    setDescription(column.Description || '');
    setShowTitle(column.NameVisible !== false);
    setOptions(column.Options || []);
    setDoneTags(column.DoneTags || []);
    setOptionColors(column.TagColors || {});
    setCheckboxColor(column.CheckboxColor || 'green');
    setWidth(column.Width ? parseInt(column.Width) : '');
    setNewOption('');
  }, [column]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAddOption = useCallback(() => {
    if (newOption.trim() && !options.includes(newOption.trim()) && !doneTags.includes(newOption.trim())) {
      const newOptions = [...options, newOption.trim()];
      setOptions(newOptions);
      setOptionColors(prev => {
        const newColors = { ...prev, [newOption.trim()]: 'blue' };
        onChangeOptions(column.ColumnId, newOptions, newColors, doneTags);
        return newColors;
      });
      setNewOption('');
    }
  }, [newOption, options, doneTags, onChangeOptions, column.ColumnId]);

  const handleRemoveOption = useCallback((option) => {
    const isInOptions = options.includes(option);
    const isInDoneTags = doneTags.includes(option);

    if (isInOptions) {
      const newOptions = options.filter((opt) => opt !== option);
      setOptions(newOptions);
      const newColors = { ...optionColors };
      delete newColors[option];
      setOptionColors(newColors);
      onChangeOptions(column.ColumnId, newOptions, newColors, doneTags);
    } else if (isInDoneTags) {
      const newDoneTags = doneTags.filter((tag) => tag !== option);
      setDoneTags(newDoneTags);
      const newColors = { ...optionColors };
      delete newColors[option];
      setOptionColors(newColors);
      onChangeOptions(column.ColumnId, options, newColors, newDoneTags);
    }
  }, [options, doneTags, optionColors, onChangeOptions, column.ColumnId]);

  const handleEditOption = useCallback((oldOption, newOption) => {
    const isInOptions = options.includes(oldOption);
    const isInDoneTags = doneTags.includes(oldOption);

    if (isInOptions) {
      const newOptions = options.map(opt => opt === oldOption ? newOption : opt);
      setOptions(newOptions);
      const newColors = { ...optionColors, [newOption]: optionColors[oldOption] };
      delete newColors[oldOption];
      setOptionColors(newColors);
      onChangeOptions(column.ColumnId, newOptions, newColors, doneTags);
    } else if (isInDoneTags) {
      const newDoneTags = doneTags.map(tag => tag === oldOption ? newOption : tag);
      setDoneTags(newDoneTags);
      const newColors = { ...optionColors, [newOption]: optionColors[oldOption] };
      delete newColors[oldOption];
      setOptionColors(newColors);
      onChangeOptions(column.ColumnId, options, newColors, newDoneTags);
    }
  }, [options, doneTags, optionColors, onChangeOptions, column.ColumnId]);

  const handleColorChange = useCallback((option, color) => {
    setOptionColors(prev => {
      const newColors = { ...prev, [option]: color };
      onChangeOptions(column.ColumnId, options, newColors, doneTags);
      return newColors;
    });
  }, [options, doneTags, onChangeOptions, column.ColumnId]);

  const toggleColorMenu = useCallback((option) => {
    setIsColorMenuOpen(prev => ({ ...prev, [option]: !prev[option] }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        name !== column.Name && onRename(column.ColumnId, name),
        selectedIcon !== column.EmojiIcon && onChangeIcon(column.ColumnId, selectedIcon),
        description !== column.Description && onChangeDescription(column.ColumnId, description),
        showTitle !== (column.NameVisible !== false) && onToggleTitleVisibility(column.ColumnId, showTitle),
        (['multi-select', 'todo', 'multicheckbox', 'tasktable'].includes(column.Type) &&
          (options !== column.Options || optionColors !== column.TagColors || doneTags !== column.DoneTags)) &&
          onChangeOptions(column.ColumnId, options, optionColors, doneTags),
        column.Type === 'checkbox' && checkboxColor !== column.CheckboxColor &&
          onChangeCheckboxColor(column.ColumnId, checkboxColor),
        onChangeWidth && width !== column.Width && onChangeWidth(column.ColumnId, width),
      ].filter(Boolean));
      onClose();
    } catch (err) {
      console.error('Error saving column changes:', err);
    } finally {
      setIsSaving(false);
    }
  }, [name, selectedIcon, description, showTitle, options, optionColors, doneTags, checkboxColor, width, column, onRename, onChangeIcon, onChangeDescription, onToggleTitleVisibility, onChangeOptions, onChangeCheckboxColor, onChangeWidth, onClose]);

  const handleWidthChange = useCallback((e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (onChangeWidth) {
      onChangeWidth(column.ColumnId, newWidth);
    }
  }, [onChangeWidth, column.ColumnId]);

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
    >
      <div className={`w-full max-w-md rounded-2xl ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border shadow-md p-4`}>
        <div className="">
          <div className="flex gap-2 w-full">
            <IconSelector
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
              isIconSectionExpanded={isIconSectionExpanded}
              setIsIconSectionExpanded={setIsIconSectionExpanded}
              icons={icons}
              darkMode={darkMode}

            />
            <ColumnNameInput name={name} setName={setName} darkMode={darkMode} setShowTitle={setShowTitle} showTitle={showTitle} />
          </div>
          <DescriptionInput description={description} setDescription={setDescription} darkMode={darkMode} />
          <ColumnPositionControls onMoveUp={onMoveUp} onMoveDown={onMoveDown} canMoveUp={canMoveUp} canMoveDown={canMoveDown} darkMode={darkMode} width={width} handleWidthChange={handleWidthChange} />
          {['multi-select', 'todo', 'multicheckbox', 'tasktable'].includes(column.Type) && (
            <OptionsList
              columnType={column.Type}
              options={options}
              doneTags={doneTags}
              newOption={newOption}
              setNewOption={setNewOption}
              handleAddOption={handleAddOption}
              handleRemoveOption={handleRemoveOption}
              handleEditOption={handleEditOption}
              handleColorChange={handleColorChange}
              optionColors={optionColors}
              darkMode={darkMode}
              isColorMenuOpen={isColorMenuOpen}
              toggleColorMenu={toggleColorMenu}
            />
          )}
          {column.Type === 'checkbox' && (
            <CheckboxColorPicker
              checkboxColor={checkboxColor}
              setCheckboxColor={setCheckboxColor}
              darkMode={darkMode}
              isColorMenuOpen={isColorMenuOpen.checkbox}
              toggleColorMenu={() => toggleColorMenu('checkbox')}
            />
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteColumn(column.ColumnId); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors duration-200`}
              aria-label="Delete column"
            >
              Delete
            </button>
            <BubbleBtn onClick={handleSave} disablet={isSaving} darkTheme={darkMode} light={false}>
              Save Changes
            </BubbleBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ColumnMenu);