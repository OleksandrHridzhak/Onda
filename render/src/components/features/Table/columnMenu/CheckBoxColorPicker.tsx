import React from 'react';
import { getColorOptions } from '../../../utils/colorOptions';

interface CheckboxColorPickerProps {
  checkboxColor: string;
  setCheckboxColor: (color: string) => void;
  darkMode: boolean;
  isColorMenuOpen: boolean;
  toggleColorMenu: () => void;
}

export const CheckboxColorPicker: React.FC<CheckboxColorPickerProps> = ({
  checkboxColor,
  setCheckboxColor,
  darkMode,
  isColorMenuOpen,
  toggleColorMenu,
}) => (
  <div className="mb-4">
    <label className={`block text-sm font-medium text-textTableValues mb-1`}>
      Checkbox Color
    </label>
    <div className="">
      <div
        className={` mt-2 bg-background border-border text-text border rounded-lg p-2 z-10`}
      >
        <div className="flex flex-wrap gap-2 max-h-32 ">
          {getColorOptions({ darkMode }).map((color) => (
            <button
              key={color.name}
              onClick={() => {
                setCheckboxColor(color.name);
                toggleColorMenu();
              }}
              className={`w-6 h-6 rounded-full ${color.bg} ${color.text || 'text-text'} border ${checkboxColor === color.name ? 'ring-2 ring-offset-2 ring-primaryColor' : 'border-transparent'} hover:ring-1 hover:ring-border transition-all duration-200`}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);
