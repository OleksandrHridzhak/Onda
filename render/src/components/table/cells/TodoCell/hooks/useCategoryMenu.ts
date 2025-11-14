import { useState, useEffect, useRef } from 'react';

interface CategoryMenuState {
  isCategoryMenuOpen: boolean;
  setIsCategoryMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryMenuRef: React.RefObject<HTMLDivElement>;
}

export const useCategoryMenu = (): CategoryMenuState => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    isCategoryMenuOpen,
    setIsCategoryMenuOpen,
    categoryMenuRef,
  };
};
