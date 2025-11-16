import React from 'react';

interface InputTextProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  darkMode?: boolean;
  placeholder?: string;
  width?: string;
}

export const InputText: React.FC<InputTextProps> = ({
  onChange,
  value,
  darkMode = false,
  placeholder = '',
  width = 'full',
}) => {
  const widthClass = width === 'full' ? 'w-full' : `w-[${width}]`;

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`${widthClass} px-4 py-2.5 border ${
        darkMode
          ? 'border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500'
          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400 ${
        darkMode ? 'hover:border-gray-600' : ''
      }`}
      placeholder={placeholder}
    />
  );
};
