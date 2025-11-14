import { useState, useEffect, useRef } from 'react';

export const useTagsDropdown = (value) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    typeof value === 'string' && value.trim() !== ''
      ? value.split(', ').filter((tag) => tag.trim() !== '')
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
    selectedTags,
    setSelectedTags,
    dropdownRef,
  };
};
