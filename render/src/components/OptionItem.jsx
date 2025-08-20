import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { getColorOptions } from "./utils/colorOptions";

export const OptionItem = ({
  option,
  options,
  doneTags,
  optionColors,
  darkMode,
  handleColorChange,
  handleRemoveOption,
  handleEditOption,
}) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [visible, setVisible] = useState(false); // для анімації появи
  const menuRef = useRef(null);

  const startEditing = () => {
    setEditingOption(option);
    setEditValue(option);
  };

  const saveEdit = () => {
    if (
      editValue.trim() &&
      !options.includes(editValue.trim()) &&
      !doneTags.includes(editValue.trim())
    ) {
      handleEditOption(option, editValue.trim());
    }
    setEditingOption(null);
    setEditValue("");
    setIsContextMenuOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 20); // маленька затримка перед появою
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsContextMenuOpen(false);
      }
    };
    if (isContextMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isContextMenuOpen]);

  return (
    <div
      key={option}
      className={`relative transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {editingOption === option ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
            className={`px-2 py-1 rounded-full text-xs font-medium border ${
              darkMode
                ? "border-gray-700 bg-gray-900 text-gray-200"
                : "border-gray-300 bg-white text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            aria-label={`Edit ${option}`}
          />
          <button
            onClick={saveEdit}
            className={`ml-2 p-1 rounded-lg ${
              darkMode
                ? "text-indigo-400 hover:bg-gray-700"
                : "text-indigo-500 hover:bg-gray-100"
            } transition-colors duration-200`}
            aria-label={`Save edit for ${option}`}
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              getColorOptions({ darkMode }).find(
                (c) => c.name === optionColors[option]
              )?.bg
            } ${
              getColorOptions({ darkMode }).find(
                (c) => c.name === optionColors[option]
              )?.text || (darkMode ? "text-gray-200" : "text-gray-800")
            }`}
            aria-label={`Options for ${option}`}
          >
            {option} {doneTags.includes(option) && "(Completed)"}
          </button>
          {isContextMenuOpen && (
            <div
              ref={menuRef}
              className={`absolute left-0 top-full mt-1 ${
                darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              } border rounded-lg shadow-lg p-2 z-10`}
            >
              <div className="flex items-center space-x-2 p-2 overflow-x-auto max-w-xs">
                {getColorOptions({ darkMode }).map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      handleColorChange(option, color.name);
                      setIsContextMenuOpen(false);
                    }}
                    className={`w-6 h-6 rounded-full ${color.bg} ${
                      color.text || (darkMode ? "text-gray-200" : "text-gray-800")
                    } border-2 ${
                      optionColors[option] === color.name
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : "border-transparent"
                    } hover:scale-110 hover:shadow-md transition-all duration-200`}
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
                  className={`p-1 rounded-lg ${
                    darkMode ? "text-indigo-400 hover:bg-gray-700" : "text-indigo-500 hover:bg-gray-100"
                  } transition-colors duration-200`}
                  aria-label={`Edit ${option}`}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    handleRemoveOption(option);
                    setIsContextMenuOpen(false);
                  }}
                  className={`p-1 rounded-lg ${
                    darkMode ? "text-red-400 hover:bg-gray-700" : "text-red-500 hover:bg-gray-100"
                  } transition-colors duration-200`}
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
