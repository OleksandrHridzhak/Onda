import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { getCheckBoxColorOptions } from '../../utils/colorOptions';
import { useSelector } from 'react-redux';

export const MultiCheckboxCell = ({
  value,
  onChange,
  options,
  tagColors = {},
}) => {
  const { themeMode } = useSelector((state) => state.newTheme);
  const darkMode = themeMode === 'dark' ? true : false;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    typeof value === 'string' && value.trim() !== ''
      ? value.split(', ').filter((opt) => opt.trim() !== '')
      : []
  );
  const dropdownRef = useRef(null);
  const canvasRef = useRef(null);

  // Clean color palette with consistent order

  const colorOptions = getCheckBoxColorOptions({ darkMode });

  // Fixed color order
  const colorOrder = ['green', 'blue', 'purple', 'orange'];

  // Get color for option based on fixed sequence
  const getColorForOption = (option, index) => {
    if (tagColors[option]) return tagColors[option];
    return colorOrder[index % colorOrder.length];
  };

  // Draw clean circular progress indicator
  const drawCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio || 1;
    const size = 32;
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 4;
    const lineWidth = 4.5;
    const totalOptions = options.length || 1;
    const progress = selectedOptions.length / totalOptions;
    const gapDegrees = 0;
    const gapRadians = (gapDegrees * Math.PI) / 180;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw subtle background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = darkMode ? '#374151' : '#e5e7eb';
    ctx.stroke();

    // Draw selected segments
    const totalAngle = 2 * Math.PI * progress;
    const segmentCount = selectedOptions.length;
    const anglePerSegment =
      segmentCount > 1
        ? (totalAngle - gapRadians * (segmentCount - 1)) / segmentCount
        : totalAngle;

    selectedOptions.forEach((option, index) => {
      const startAngle = index * (anglePerSegment + gapRadians) - Math.PI / 2;
      const endAngle = startAngle + anglePerSegment;
      const color = tagColors[option] || colorOrder[index % colorOrder.length];
      const arcColor = colorOptions[color]?.hex || colorOptions.green.hex;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = arcColor;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  };

  useEffect(() => {
    drawCircle();
  }, [selectedOptions, darkMode, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOptions((prevOptions) => {
      const updatedOptions = prevOptions.includes(option)
        ? prevOptions.filter((opt) => opt !== option)
        : [...prevOptions, option];
      onChange(updatedOptions.join(', '));
      return updatedOptions;
    });
  };

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
            const color = getColorForOption(option, index);
            const colorOption = colorOptions[color] || colorOptions.green;
            const isSelected = selectedOptions.includes(option);

            return (
              <div
                key={option}
                className={`px-3 py-2 ${
                  darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                } cursor-pointer text-sm flex items-center`}
                onClick={() => handleOptionChange(option)}
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
