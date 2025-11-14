import React from 'react';
import { useSelector } from 'react-redux';
import { useMultiCheckboxDropdown } from './hooks/useMultiCheckboxDropdown';
import { useCircleCanvas } from './hooks/useCircleCanvas';
import { getColorForOption, handleOptionChange } from './logic';

export const MultiCheckboxCell = ({
  value,
  onChange,
  options,
  tagColors = {},
}) => {
  const { themeMode } = useSelector((state) => state.newTheme);
  const darkMode = themeMode === 'dark' ? true : false;
  
  const {
    isOpen,
    setIsOpen,
    selectedOptions,
    setSelectedOptions,
    dropdownRef,
  } = useMultiCheckboxDropdown(value);

  const { canvasRef, colorOptions, colorOrder } = useCircleCanvas(
    selectedOptions,
    options,
    tagColors
  );

  return (
    <div
      className="relative flex justify-center items-center"
      ref={dropdownRef}
    >
      {/* Clean circular indicator */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer  flex items-center justify-center w-8 h-8 hover:opacity-80 transition-opacity"
      >
        <canvas
          ref={canvasRef}
          width={32}
          height={32}
          style={{ width: '32px', height: '32px' }}
        />
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-48 ${
            darkMode
              ? 'bg-gray-800 text-gray-200 border border-gray-700'
              : 'bg-white text-gray-800 border border-gray-200'
          } rounded-lg max-h-64 overflow-auto`}
          style={{ top: '100%' }}
        >
          {(options || []).map((option, index) => {
            const color = getColorForOption(option, index, tagColors, colorOrder);
            const colorOption = colorOptions[color] || colorOptions.green;
            const isSelected = selectedOptions.includes(option);

            return (
              <div
                key={option}
                className={`px-3 py-2 ${
                  darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                } cursor-pointer text-sm flex items-center`}
                onClick={() => handleOptionChange(option, selectedOptions, setSelectedOptions, onChange)}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${colorOption.bg} ${
                    isSelected ? 'opacity-100' : 'opacity-30'
                  }`}
                />
                <span className="flex-1">{option}</span>
                {isSelected && (
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
