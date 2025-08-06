import React from 'react';
import { Check } from 'lucide-react';
import {getCheckBoxColorOptions} from '../utils/colorOptions';

export const CheckboxCell = ({ checked, onChange, color = 'green', darkMode }) => {
  
  const colorOptions = getCheckBoxColorOptions({ darkMode });

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
                        border-transparent
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