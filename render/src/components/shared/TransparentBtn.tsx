import React from 'react';

interface TransparentBtnProps {
  children: React.ReactNode;
  onClick: (e?: React.MouseEvent) => void;
  darkTheme?: boolean;
  disablet?: boolean;
  disabled?: boolean;
}

export const TransparentBtn: React.FC<TransparentBtnProps> = ({
  children,
  onClick,
  darkTheme = false,
  disablet = false,
  disabled = false,
}) => {
  const isDisabled = disablet || disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`px-3 py-2.5 items-center justify-center text-sm w-full flex border rounded-xl transition-all duration-200 ${
        darkTheme
          ? 'bg-transparent hover:bg-blue-600 hover:text-white border-gray-700 focus:ring-2 focus:ring-blue-600'
          : 'bg-transparent hover:bg-blue-600 hover:text-white border-gray-300 focus:ring-2 focus:ring-blue-500'
      } ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer transform hover:scale-105 active:scale-95'
      } focus:outline-none focus:ring-offset-2`}
    >
      {children}
    </button>
  );
};
