import { useState, useEffect, useRef } from 'react';

interface TagsDropdownState {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const useTagsDropdown = (value: string): TagsDropdownState => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    typeof value === 'string' && value.trim() !== ''
      ? value.split(', ').filter((tag) => tag.trim() !== '')
      : [],
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
