import { useState, useEffect, useRef } from 'react';

interface MultiCheckboxDropdownState {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const useMultiCheckboxDropdown = (value: string): MultiCheckboxDropdownState => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    typeof value === 'string' && value.trim() !== ''
      ? value.split(', ').filter((opt) => opt.trim() !== '')
      : []
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    isOpen,
    setIsOpen,
    selectedOptions,
    setSelectedOptions,
    dropdownRef,
  };
};
