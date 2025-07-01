import React from 'react';
import { Check } from 'lucide-react';

export const CheckboxCell = ({ checked, onChange, color = 'green', darkMode }) => {
  const colorOptions = {
    green: {
      bg: darkMode ? 'bg-green-500' : 'bg-green-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-green-600' : 'hover:bg-green-400'
    },
    blue: {
      bg: darkMode ? 'bg-blue-700' : 'bg-blue-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-400'
    },
    purple: {
      bg: darkMode ? 'bg-purple-700' : 'bg-purple-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-purple-600' : 'hover:bg-purple-400'
    },
    orange: {
      bg: darkMode ? 'bg-orange-700' : 'bg-orange-500',
      border: 'border-transparent',
      hover: darkMode ? 'hover:bg-orange-600' : 'hover:bg-orange-400'
    }
  };

  const selectedColor = colorOptions[color] || colorOptions.green;

  const handleToggle = () => {
    onChange(!checked); 
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <label className="relative flex items-center justify-center w-6 h-6 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle} 
          className="sr-only peer"
        />
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center 
                        transition-all duration-150 ease-in-out
                        ${selectedColor.border}
                        ${checked ? selectedColor.bg : ''}
                        ${checked ? selectedColor.hover : 'hover:border-gray-500'}`}>
          <Check
            size={16}
            className={`absolute text-white transition-opacity duration-150 ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
            strokeWidth={3}
          />
        </div>
      </label>
    </div>
  );
};