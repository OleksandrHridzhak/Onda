import React from 'react';

export const BubbleBtn = ({
  children,
  onClick,
  darkTheme = false,
  disablet = false,
  light = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disablet}
      className={`items-center flex px-3 py-2 text-sm text-white ${darkTheme ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl transition-colors`}
    >
      {children}
    </button>
  );
};
