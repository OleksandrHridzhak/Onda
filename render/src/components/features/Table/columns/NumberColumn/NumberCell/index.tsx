import React from 'react';

interface NumberCellProps {
  value: string | number;
  onChange: (value: string) => void;
}

export const NumberCell: React.FC<NumberCellProps> = ({ value, onChange }) => {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-center px-1 py-0.5 text-lg bg-transparent border-none 
                 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none text-textTableValues
                 [&::-webkit-outer-spin-button]:appearance-none
                 [&::-webkit-inner-spin-button]:appearance-none"
      style={{
        MozAppearance: 'textfield', // Для Firefox
      }}
    />
  );
};
