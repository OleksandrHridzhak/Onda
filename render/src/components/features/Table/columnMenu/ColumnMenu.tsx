import React, { useReducer, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { icons } from '../../../utils/icons';
import { BubbleBtn } from '../../../shared/BubbleBtn';
import { IconSelector } from './IconSelector';
import { TransparentBtn } from '../../../shared/TransparentBtn';
import { OptionsList } from './OptionList';
import { TitleVisibilityToggle } from './TitleVisibilityToggle';
import { reducer, initialState } from './columnMenuReducer';
import {
  handleAddOption,
  handleRemoveOption,
  handleEditOption,
  handleColorChange,
  handleSave,
  handleWidthChange,
} from './columnMenuHandlers';
import { CheckboxColorPicker } from './CheckBoxColorPicker';

import { ColumnData } from '../../../../types/column.types';

type Column = ColumnData;

interface ColumnMenuProps {
  column: Column;
  handleDeleteColumn: (id: string) => void;
  handleClearColumn: (id: string) => void;
  onClose: () => void;
  onRename: (id: string, name: string) => void;
  onChangeIcon: (id: string, icon: string) => void;
  onChangeDescription: (id: string, description: string) => void;
  onToggleTitleVisibility: (id: string, visible: boolean) => void;
  onChangeOptions: (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChangeWidth: (id: string, width: number) => void;
  onChangeCheckboxColor?: (id: string, color: string) => void;
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({
  column,
  handleDeleteColumn,
  handleClearColumn,
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
  onChangeWidth,
  onChangeCheckboxColor = () => {},
}) => {
  const [state, dispatch] = useReducer(reducer, column, initialState);
  const menuRef = useRef(null);
  const darkMode =
    document.documentElement.getAttribute('data-theme-mode') === 'dark';

  useEffect(() => {
    dispatch({ type: 'RESET', payload: column });
  }, [column]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className={`fixed z-50 cursor-default inset-0 flex items-center justify-center bg-black bg-opacity-50 text-text`}
    >
      <div
        className={`w-full max-w-md rounded-2xl bg-background border-border border shadow-md p-4`}
        ref={menuRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg z-55 font-semibold text-text`}>
            Column Settings
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close column settings"
            className={`p-1 rounded-full text-textTableValues hover:bg-hoverBg transition-colors duration-200`}
          >
            <X size={20} />
          </button>
        </div>
        <div className="">
          <div className="flex gap-2 w-full">
            <IconSelector
              selectedIcon={state.selectedIcon}
              setSelectedIcon={(icon) =>
                dispatch({ type: 'SET_SELECTED_ICON', payload: icon })
              }
              isIconSectionExpanded={state.isIconSectionExpanded}
              setIsIconSectionExpanded={() =>
                dispatch({ type: 'TOGGLE_ICON_SECTION' })
              }
              icons={icons}
              darkMode={darkMode}
            />
            <div className="w-full flex relative">
              <input
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({ type: 'SET_NAME', payload: e.target.value })
                }
                className={`w-full h-[50px] px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200`}
                placeholder="Column name"
              />
              <TitleVisibilityToggle
                showTitle={state.showTitle}
                setShowTitle={(value) =>
                  dispatch({ type: 'SET_SHOW_TITLE', payload: value })
                }
                darkMode={darkMode}
              />
            </div>
          </div>
          <div className="">
            <textarea
              value={state.description}
              placeholder="Description"
              onChange={(e) =>
                dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
              }
              className={`w-full px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200 resize-none`}
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium text-textTableValues mb-1`}
            >
              Column Position and width
            </label>
            <div className="flex space-x-2">
              <div className="w-full">
                <input
                  type="number"
                  value={state.width}
                  onChange={(e) =>
                    handleWidthChange(dispatch, onChangeWidth, column, e)
                  }
                  min="0"
                  max="1000"
                  className={`w-full px-3 py-2.5 flex items-center text-sm border bg-transparent border-border text-text rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primaryColor`}
                  placeholder="Enter width in pixels"
                  aria-label="Column width"
                />
              </div>
              <TransparentBtn
                onClick={() => onMoveUp(column.id)}
                disabled={!canMoveUp}
                darkTheme={darkMode}
              >
                <ArrowLeft size={18} /> LEFT
              </TransparentBtn>
              <TransparentBtn
                onClick={() => onMoveDown(column.id)}
                disabled={!canMoveDown}
                darkTheme={darkMode}
              >
                RIGHT <ArrowRight size={18} />
              </TransparentBtn>
            </div>
          </div>
          {['multiselect', 'todo', 'multicheckbox', 'tasktable'].includes(
            column.type,
          ) && (
            <OptionsList
              columnType={column.type}
              options={state.options}
              doneTags={state.doneTags}
              newOption={state.newOption}
              setNewOption={(value) =>
                dispatch({ type: 'SET_NEW_OPTION', payload: value })
              }
              handleAddOption={() =>
                handleAddOption(state, dispatch, column, onChangeOptions)
              }
              handleRemoveOption={(option) =>
                handleRemoveOption(
                  state,
                  dispatch,
                  column,
                  onChangeOptions,
                  option,
                )
              }
              handleEditOption={(oldOption, newOption) =>
                handleEditOption(
                  state,
                  dispatch,
                  column,
                  onChangeOptions,
                  oldOption,
                  newOption,
                )
              }
              handleColorChange={(option, color) =>
                handleColorChange(
                  state,
                  dispatch,
                  column,
                  onChangeOptions,
                  option,
                  color,
                )
              }
              optionColors={state.optionColors}
              darkMode={darkMode}
              isColorMenuOpen={state.isColorMenuOpen}
              toggleColorMenu={(option) =>
                dispatch({ type: 'TOGGLE_COLOR_MENU', payload: option })
              }
            />
          )}
          {column.type === 'checkbox' && (
            <CheckboxColorPicker
              checkboxColor={state.checkboxColor}
              setCheckboxColor={(color) =>
                dispatch({ type: 'SET_CHECKBOX_COLOR', payload: color })
              }
              darkMode={darkMode}
              isColorMenuOpen={state.isColorMenuOpen.checkbox}
              toggleColorMenu={() =>
                dispatch({ type: 'TOGGLE_COLOR_MENU', payload: 'checkbox' })
              }
            />
          )}
          <div className="flex justify-between gap-2 mt-6">
            <div className="flex gap-2">
              <BubbleBtn
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      `Are you sure you want to delete "${column.description || 'this column'}"? This action cannot be undone.`,
                    )
                  ) {
                    handleDeleteColumn(column.id);
                    onClose();
                  }
                }}
                disabled={state.isSaving}
                variant="delete"
              >
                Delete
              </BubbleBtn>
              <BubbleBtn
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearColumn(column.id);
                }}
                disabled={state.isSaving}
                variant="clear"
              >
                Clear column
              </BubbleBtn>
            </div>
            <BubbleBtn
              onClick={(e) => {
                e.stopPropagation();
                handleSave(
                  state,
                  dispatch,
                  column,
                  onRename,
                  onChangeIcon,
                  onChangeDescription,
                  onToggleTitleVisibility,
                  onChangeOptions,
                  onChangeCheckboxColor,
                  onChangeWidth,
                  onClose,
                );
              }}
              disabled={state.isSaving}
              variant="standard"
            >
              Save Changes
            </BubbleBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ColumnMenu);
