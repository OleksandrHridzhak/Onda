import React from 'react';

interface InputTextProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  width?: string;
  type?: 'text' | 'password' | 'email' | 'tel' | 'number';
  className?: string; // can override width/height here
}

export const InputText: React.FC<InputTextProps> = ({
  onChange,
  value,
  placeholder = '',
  width = 'full',
  type = 'text',
  className = '',
}) => {
  const widthClass = width === 'full' ? 'w-full' : `w-[${width}]`;

  const baseClass =
    'h-[50px] px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200';

  const finalClass = `${widthClass} ${baseClass} ${className}`.trim();

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={finalClass}
      placeholder={placeholder}
    />
  );
};
