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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disablet || disabled}
      className={`px-3 py-2.5 alight-center justify-center text-sm w-full flex border ${darkTheme ? 'bg-transparent hover:bg-blue-600 border-gray-700' : 'bg-transparent hover:bg-blue-600 hover:text-white border-gray-300'} rounded-xl transition-colors`}
    >
      {children}
    </button>
  );
};
