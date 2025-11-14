import React from 'react';

interface BubbleBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'standard' | 'delete' | 'clear';
}

export const BubbleBtn: React.FC<BubbleBtnProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'standard',
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
      className={`items-center flex px-4 py-2.5 text-sm rounded-xl transition ${variantClass[variant]}`}
    >
      {children}
    </button>
  );
};
