import React from 'react';
import { getColorOptions } from '../../utils/colorOptions';

export const CheckboxColorPicker = ({
  checkboxColor,
  setCheckboxColor,
  darkMode,
  isColorMenuOpen,
  toggleColorMenu,
}) => (
  <div className="mb-4">
    <label
      className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}
    >
      Checkbox Color
    </label>
    <div className="">
      <div
        className={` mt-2 ${darkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} border rounded-lg p-2 z-10`}
      >
        <div className="flex flex-wrap gap-2 max-h-32 ">
          {getColorOptions({ darkMode }).map((color) => (
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
    </div>
  </div>
);