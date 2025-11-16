import React from 'react';

interface Column {
  NameVisible: boolean;
  Name: string;
  Description: string;
}

interface DescriptionHoverBoxProps {
  darkMode: boolean;
  column: Column;
}

export const DescriptionHoverBox: React.FC<DescriptionHoverBoxProps> = ({
  darkMode,
  column,
}) => {
  return (
    <div
      className={`absolute z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
        darkMode
          ? 'bg-gray-800 text-gray-200 border border-gray-700 shadow-lg'
          : 'bg-gray-800 text-white shadow-xl'
      } text-xs rounded-lg py-2 px-3 mb-20 min-w-48 max-w-72 whitespace-normal`}
      style={{ transitionDelay: '0.3s' }}
    >
      {column.NameVisible === false ? (
        <span className="font-semibold">{column.Name}: </span>
      ) : (
        ''
      )}
      {column.Description}
      <div
        className={`absolute left-2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 ${
          darkMode ? 'border-t-gray-800' : 'border-t-gray-800'
        }`}
      ></div>
    </div>
  );
};
