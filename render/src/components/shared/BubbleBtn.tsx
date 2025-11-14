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
    standard: 'bg-primaryColor text-white',
    delete: 'bg-bubbleBtnDelete text-white',
    clear: 'bg-bubbleBtnClear text-bubbleBtnClearText',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        className ||
        `items-center flex px-4 py-2.5 text-sm rounded-xl transition ${variantClass[variant]}`
      }
    >
      {children}
    </button>
  );
};
