import { useState, useEffect } from 'react';

export const useNumberInput = (value: string | number) => {
  const [localValue, setLocalValue] = useState<string | number>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return {
    localValue,
    setLocalValue,
  };
};
