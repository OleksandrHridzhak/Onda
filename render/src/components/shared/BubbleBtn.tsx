import React from 'react';

interface BubbleBtnProps {
  children: React.ReactNode;
  onClick: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  variant?: 'standard' | 'delete' | 'clear';
  className?: string;
}

export const BubbleBtn: React.FC<BubbleBtnProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'standard',
  className = '',
}) => {
  const variantClass: Record<string, string> = {
    standard:
      'bg-primaryColor text-white hover:bg-bubbleBtnStandardHover focus:ring-2 focus:ring-primaryColor focus:ring-offset-2',
    delete:
      'bg-bubbleBtnDelete text-white hover:bg-bubbleBtnDeleteHover focus:ring-2 focus:ring-bubbleBtnDelete focus:ring-offset-2',
    clear:
      'bg-bubbleBtnClear text-bubbleBtnClearText hover:bg-bubbleBtnClearHover focus:ring-2 focus:ring-bubbleBtnClear focus:ring-offset-2',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        className ||
        `items-center flex px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${variantClass[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105 active:scale-95'} focus:outline-none`
      }
    >
      {children}
    </button>
  );
};
