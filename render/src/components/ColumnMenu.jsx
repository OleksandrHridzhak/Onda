// ColumnMenu.js
import React, { useReducer, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { icons } from './utils/icons';
import { getColorOptions } from './utils/colorOptions';
import { BubbleBtn } from './atoms/BubbleBtn';
import { IconSelector } from './atoms/IconSelector';
import { TransparentBtn } from './atoms/TransparentBtn';
import { OptionsList } from './OptionList';
import { reducer, initialState } from '../reducers/columnMenuReducer';
import { deleteColumn, updateColumn, getColumnById, resetSelectedColumn } from '../store/table/tableSlice';

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

const CheckboxColorPicker = ({ checkboxColor, setCheckboxColor, darkMode, isColorMenuOpen, toggleColorMenu }) => (
  <div className="mb-4">
    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
      Checkbox Color
    </label>
    <div className={`mt-2 ${darkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} border rounded-lg p-2 z-10`}>
      <div className="flex flex-wrap gap-2 max-h-32">
        {getColorOptions({ darkMode }).map((color) => (
          <button
            key={color.name}
            onClick={() => {
              setCheckboxColor(color.name);
              toggleColorMenu();
            }}
            className={`w-6 h-6 rounded-full ${color.bg} ${color.text || (darkMode ? 'text-gray-200' : 'text-gray-800')} border ${
              checkboxColor === color.name ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border-transparent'
            } hover:ring-1 hover:ring-gray-400 transition-all duration-200`}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  </div>
);

const ColumnMenu = ({ id, onClose, canMoveUp, canMoveDown, darkMode, onMoveUp, onMoveDown }) => {
  const dispatch = useDispatch();
  const column = useSelector((state) => state.table.selectedColumn);
  const [state, dispatchLocal] = useReducer(reducer, column, initialState);
  const menuRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(getColumnById(id));
    }
    return () => {
      dispatch(resetSelectedColumn());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (column) {
      dispatchLocal({ type: 'RESET', payload: column });
    }
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

  const handleAddOption = () => {
    dispatchLocal({ type: 'ADD_OPTION' });
  };

  const handleRemoveOption = (option) => {
    dispatchLocal({ type: 'REMOVE_OPTION', payload: option });
  };

  const handleEditOption = (oldOption, newOption) => {
    dispatchLocal({ type: 'EDIT_OPTION', payload: { oldOption, newOption } });
  };

  const handleColorChange = (option, color) => {
    dispatchLocal({ type: 'CHANGE_OPTION_COLOR', payload: { option, color } });
  };

  const handleSave = async () => {
    dispatchLocal({ type: 'SET_SAVING', payload: true });
    try {
      const updatedColumn = {
        ...column,
        Name: state.name,
        EmojiIcon: state.selectedIcon,
        Description: state.description,
        NameVisible: state.showTitle,
        Options: state.options,
        DoneTags: state.doneTags,
        TagColors: state.optionColors,
        CheckboxColor: state.checkboxColor,
        Width: state.width,
      };
      await dispatch(updateColumn(updatedColumn)).unwrap();
      onClose();
    } catch (err) {
      dispatchLocal({ type: 'SET_ERROR', payload: 'Failed to save changes. Please try again.' });
    } finally {
      dispatchLocal({ type: 'SET_SAVING', payload: false });
    }
  };

  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10) || 100;
    dispatchLocal({ type: 'SET_WIDTH', payload: newWidth });
  };

  return (
    <div className={`fixed z-50 cursor-default inset-0 flex items-center justify-center bg-black bg-opacity-50 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className={`w-full max-w-md rounded-2xl ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border shadow-md p-4`} ref={menuRef}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Column Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close column settings"
            className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
          >
            <X size={20} />
          </button>
        </div>
        {state.error && <div className="text-red-500 text-sm mb-4">{state.error}</div>}
        <div>
          <div className="flex gap-2 w-full">
            <IconSelector
              selectedIcon={state.selectedIcon}
              setSelectedIcon={(icon) => dispatchLocal({ type: 'SET_SELECTED_ICON', payload: icon })}
              isIconSectionExpanded={state.isIconSectionExpanded}
              setIsIconSectionExpanded={() => dispatchLocal({ type: 'TOGGLE_ICON_SECTION' })}
              icons={icons}
              darkMode={darkMode}
            />
            <div className="w-full flex relative">
              <input
                type="text"
                value={state.name}
                onChange={(e) => dispatchLocal({ type: 'SET_NAME', payload: e.target.value })}
                className={`w-full h-[50px] px-4 py-2 border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200`}
                placeholder="Column name"
                aria-label="Column name input"
              />
              <TitleVisibilityToggle
                showTitle={state.showTitle}
                setShowTitle={(value) => dispatchLocal({ type: 'SET_SHOW_TITLE', payload: value })}
                darkMode={darkMode}
              />
            </div>
          </div>
          <div>
            <textarea
              value={state.description}
              placeholder="Description"
              onChange={(e) => dispatchLocal({ type: 'SET_DESCRIPTION', payload: e.target.value })}
              className={`w-full px-4 py-2 border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 resize-none`}
              rows="3"
              aria-label="Column description"
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>Column Position and width</label>
            <div className="flex space-x-2">
              <div className="w-full">
                <input
                  type="number"
                  value={state.width}
                  onChange={handleWidthChange}
                  min="50"
                  max="1000"
                  className={`w-full px-3 py-2.5 flex items-center text-sm border ${darkMode ? 'bg-transparent border-gray-700 text-gray-200 hover:text-white' : 'bg-transparent border-gray-300 text-gray-900'} rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Enter width in pixels"
                  aria-label="Column width"
                />
              </div>
              <TransparentBtn onClick={onMoveUp} disabled={!canMoveUp} darkTheme={darkMode}>
                <ArrowLeft size={18} /> LEFT
              </TransparentBtn>
              <TransparentBtn onClick={onMoveDown} disabled={!canMoveDown} darkTheme={darkMode}>
                RIGHT <ArrowRight size={18} />
              </TransparentBtn>
            </div>
          </div>
          {['multi-select', 'todo', 'multicheckbox', 'tasktable'].includes(column?.Type) && (
            <OptionsList
              columnType={column?.Type}
              options={state.options}
              doneTags={state.doneTags}
              newOption={state.newOption}
              setNewOption={(value) => dispatchLocal({ type: 'SET_NEW_OPTION', payload: value })}
              handleAddOption={handleAddOption}
              handleRemoveOption={handleRemoveOption}
              handleEditOption={handleEditOption}
              handleColorChange={handleColorChange}
              optionColors={state.optionColors}
              darkMode={darkMode}
              isColorMenuOpen={state.isColorMenuOpen}
              toggleColorMenu={(option) => dispatchLocal({ type: 'TOGGLE_COLOR_MENU', payload: option })}
            />
          )}
          {column?.Type === 'checkbox' && (
            <CheckboxColorPicker
              checkboxColor={state.checkboxColor}
              setCheckboxColor={(color) => dispatchLocal({ type: 'SET_CHECKBOX_COLOR', payload: color })}
              darkMode={darkMode}
              isColorMenuOpen={state.isColorMenuOpen?.checkbox}
              toggleColorMenu={() => dispatchLocal({ type: 'TOGGLE_COLOR_MENU', payload: 'checkbox' })}
            />
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => dispatch(deleteColumn(column.ColumnId))}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors duration-200`}
              aria-label="Delete column"
            >
              Delete
            </button>
            <BubbleBtn onClick={handleSave} disabled={state.isSaving} darkTheme={darkMode} light={false}>
              {state.isSaving ? 'Saving...' : 'Save Changes'}
            </BubbleBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ColumnMenu);