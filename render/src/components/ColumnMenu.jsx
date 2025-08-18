import React, { useReducer, useEffect, useRef } from "react";
import {
  X,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { icons } from "./utils/icons";
import { getColorOptions } from "./utils/colorOptions";
import { BubbleBtn } from "./atoms/BubbleBtn";
import { IconSelector } from "./atoms/IconSelector";
import { TransparentBtn } from "./atoms/TransparentBtn";
import { OptionsList } from "./OptionList";
import { reducer, initialState } from "../reducers/columnMenuReducer";


// Sub-components (unchanged)
const TitleVisibilityToggle = ({ showTitle, setShowTitle, darkMode }) => (
  <div className="flex items-center h-12 w-12 justify-center absolute right-0 top-0">
    <button
      onClick={() => setShowTitle(!showTitle)}
      className={`flex items-center space-x-2 ${darkMode ? "text-gray-200" : "text-gray-700"} transition-colors duration-200`}
      aria-label={showTitle ? "Hide column title" : "Show column title"}
    >
      {showTitle ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  </div>
);
const CheckboxColorPicker = ({
  checkboxColor,
  setCheckboxColor,
  darkMode,
  isColorMenuOpen,
  toggleColorMenu,
}) => (
  <div className="mb-4">
    <label
      className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-1`}
    >
      Checkbox Color
    </label>
    <div className="">
        <div
          className={` mt-2 ${darkMode ? "bg-gray-900 border-gray-800 text-gray-200" : "bg-white border-gray-200 text-gray-800"} border rounded-lg p-2 z-10`}
        >
          <div className="flex flex-wrap gap-2 max-h-32 ">
            {getColorOptions({ darkMode }).map((color) => (
              <button
                key={color.name}
                onClick={() => {
                  setCheckboxColor(color.name);
                  toggleColorMenu();
                }}
                className={`w-6 h-6 rounded-full ${color.bg} ${color.text || (darkMode ? "text-gray-200" : "text-gray-800")} border ${checkboxColor === color.name ? "ring-2 ring-offset-2 ring-indigo-500" : "border-transparent"} hover:ring-1 hover:ring-gray-400 transition-all duration-200`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
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
  const [state, dispatch] = useReducer(reducer, column, initialState);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch({ type: "RESET", payload: column });
  }, [column]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleAddOption = () => {
    dispatch({ type: "ADD_OPTION" });
    if (
      state.newOption.trim() &&
      !state.options.includes(state.newOption.trim()) &&
      !state.doneTags.includes(state.newOption.trim())
    ) {
      onChangeOptions(
        column.ColumnId,
        [...state.options, state.newOption.trim()],
        { ...state.optionColors, [state.newOption.trim()]: "blue" },
        state.doneTags
      );
    }
  };

  const handleRemoveOption = (option) => {
    dispatch({ type: "REMOVE_OPTION", payload: option });
    const isInOptions = state.options.includes(option);
    const isInDoneTags = state.doneTags.includes(option);
    if (isInOptions) {
      const newOptions = state.options.filter((opt) => opt !== option);
      const newColors = { ...state.optionColors };
      delete newColors[option];
      onChangeOptions(column.ColumnId, newOptions, newColors, state.doneTags);
    } else if (isInDoneTags) {
      const newDoneTags = state.doneTags.filter((tag) => tag !== option);
      const newColors = { ...state.optionColors };
      delete newColors[option];
      onChangeOptions(column.ColumnId, state.options, newColors, newDoneTags);
      
    }
  };

  const handleEditOption = (oldOption, newOption) => {
    dispatch({ type: "EDIT_OPTION", payload: { oldOption, newOption } });
    const isInOptions = state.options.includes(oldOption);
    const isInDoneTags = state.doneTags.includes(oldOption);
    if (isInOptions) {
      const newOptions = state.options.map((opt) => (opt === oldOption ? newOption : opt));
      const newColors = { ...state.optionColors, [newOption]: state.optionColors[oldOption] };
      delete newColors[oldOption];
      onChangeOptions(column.ColumnId, newOptions, newColors, state.doneTags);
    } else if (isInDoneTags) {
      const newDoneTags = state.doneTags.map((tag) => (tag === oldOption ? newOption : tag));
      const newColors = { ...state.optionColors, [newOption]: state.optionColors[oldOption] };
      delete newColors[oldOption];
      onChangeOptions(column.ColumnId, state.options, newColors, newDoneTags);
    }
  };

  const handleColorChange = (option, color) => {
    dispatch({ type: "CHANGE_OPTION_COLOR", payload: { option, color } });
    onChangeOptions(column.ColumnId, state.options, { ...state.optionColors, [option]: color }, state.doneTags);
  };

const handleSave = async () => {
  dispatch({ type: "SET_SAVING", payload: true });
  try {
    if (state.name !== column.Name) {
      await onRename(column.ColumnId, state.name);
    }

    if (state.selectedIcon !== column.EmojiIcon) {
      await onChangeIcon(column.ColumnId, state.selectedIcon);
    }

    if (state.description !== column.Description) {
      await onChangeDescription(column.ColumnId, state.description);
    }

    if (state.showTitle !== (column.NameVisible !== false)) {
      await onToggleTitleVisibility(column.ColumnId, state.showTitle);
    }

    const isMultiOption = ["multi-select", "todo", "multicheckbox", "tasktable"].includes(column.Type);
    const optionsChanged =
      JSON.stringify(state.options) !== JSON.stringify(column.Options) ||
      JSON.stringify(state.optionColors) !== JSON.stringify(column.TagColors) ||
      JSON.stringify(state.doneTags) !== JSON.stringify(column.DoneTags);

    if (isMultiOption && optionsChanged) {
      await onChangeOptions(column.ColumnId, state.options, state.optionColors, state.doneTags);
    }

    if (column.Type === "checkbox" && state.checkboxColor !== column.CheckboxColor) {
      await onChangeCheckboxColor(column.ColumnId, state.checkboxColor);
    }

    if (onChangeWidth && state.width !== column.Width) {
      await onChangeWidth(column.ColumnId, state.width);
    }


  } catch (err) {
    console.error("Error saving column changes:", err);
  } finally {
    dispatch({ type: "SET_SAVING", payload: false });
    
    onClose();

  }
};


  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    dispatch({ type: "SET_WIDTH", payload: newWidth });
    if (onChangeWidth) {
      onChangeWidth(column.ColumnId, newWidth);
    }
  };

  return (
    <div
      className={`fixed z-50 cursor-default inset-0 flex items-center justify-center bg-black bg-opacity-50 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-md p-4`}
        ref={menuRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg z-55 font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            Column Settings
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close column settings"
            className={`p-1 rounded-full ${darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"} transition-colors duration-200`}
          >
            <X size={20} />
          </button>
        </div>
        <div className="">
          <div className="flex gap-2 w-full">
            <IconSelector
              selectedIcon={state.selectedIcon}
              setSelectedIcon={(icon) => dispatch({ type: "SET_SELECTED_ICON", payload: icon })}
              isIconSectionExpanded={state.isIconSectionExpanded}
              setIsIconSectionExpanded={() => dispatch({ type: "TOGGLE_ICON_SECTION" })}
              icons={icons}
              darkMode={darkMode}
            />
            <div className="w-full flex relative">
              <input
                type="text"
                value={state.name}
                onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                className={`w-full h-[50px] px-4 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-gray-200" : "border-gray-300 bg-white text-gray-900"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200`}
                placeholder="Column name"
              />
              <TitleVisibilityToggle
                showTitle={state.showTitle}
                setShowTitle={(value) => dispatch({ type: "SET_SHOW_TITLE", payload: value })}
                darkMode={darkMode}
              />
            </div>
          </div>
          <div className="">
            <textarea
              value={state.description}
              placeholder="Description"
              onChange={(e) => dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })}
              className={`w-full px-4 py-2 border ${
                darkMode
                  ? "border-gray-700 bg-gray-900 text-gray-200"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 resize-none`}
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-700"} mb-1`}
            >
              Column Position and width
            </label>
            <div className="flex space-x-2">
              <div className="w-full">
                <input
                  type="number"
                  value={state.width}
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
          {["multi-select", "todo", "multicheckbox", "tasktable"].includes(column.Type) && (
            <OptionsList
              columnType={column.Type}
              options={state.options}
              doneTags={state.doneTags}
              newOption={state.newOption}
              setNewOption={(value) => dispatch({ type: "SET_NEW_OPTION", payload: value })}
              handleAddOption={handleAddOption}
              handleRemoveOption={handleRemoveOption}
              handleEditOption={handleEditOption}
              handleColorChange={handleColorChange}
              optionColors={state.optionColors}
              darkMode={darkMode}
              isColorMenuOpen={state.isColorMenuOpen}
              toggleColorMenu={(option) => dispatch({ type: "TOGGLE_COLOR_MENU", payload: option })}
            />
          )}
          {column.Type === "checkbox" && (
            <CheckboxColorPicker
              checkboxColor={state.checkboxColor}
              setCheckboxColor={(color) => dispatch({ type: "SET_CHECKBOX_COLOR", payload: color })}
              darkMode={darkMode}
              isColorMenuOpen={state.isColorMenuOpen.checkbox}
              toggleColorMenu={() => dispatch({ type: "TOGGLE_COLOR_MENU", payload: "checkbox" })}
            />
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteColumn(column.ColumnId);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"} transition-colors duration-200`}
              aria-label="Delete column"
            >
              Delete
            </button>
            <BubbleBtn
              onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
              
              disabled={state.isSaving}
              darkTheme={darkMode}
              light={false}
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