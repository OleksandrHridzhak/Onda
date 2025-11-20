import React from 'react';
import { useNumberInput } from './hooks/useNumberInput';
import { handleNumberChange, getInputStyles } from './logic';

interface NumberCellProps {
  value: string | number;
  onChange: (value: string) => void;
}

export const NumberCell: React.FC<NumberCellProps> = ({ value, onChange }) => {
  const { localValue, setLocalValue } = useNumberInput(value);

  return (
    <input
      type="number"
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
        handleNumberChange(e.target.value, onChange);
      }}
      className="w-full text-center px-1 py-0.5 text-lg bg-transparent border-none 
                 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none
                 [&::-webkit-outer-spin-button]:appearance-none
                 [&::-webkit-inner-spin-button]:appearance-none"
      style={getInputStyles()}
    />
  );
};
