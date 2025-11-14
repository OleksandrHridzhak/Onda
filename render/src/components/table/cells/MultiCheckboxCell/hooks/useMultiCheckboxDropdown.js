import { useState, useEffect, useRef } from 'react';

export const useMultiCheckboxDropdown = (value) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    typeof value === 'string' && value.trim() !== ''
      ? value.split(', ').filter((opt) => opt.trim() !== '')
      : []
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
