import { useState } from "react";
import { useClickOutside } from "shared/hooks/useClickOutside";

interface DropdownMultiSelectState {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Generic multi-select dropdown hook used by Tags and MultiCheckbox columns.
 */
export const useDropdownMultiSelect = (
  value: string,
): DropdownMultiSelectState => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    typeof value === "string" && value.trim() !== ""
      ? value.split(", ").filter((v) => v.trim() !== "")
      : [],
  );
  const dropdownRef = useClickOutside<HTMLDivElement>(
    () => setIsOpen(false),
    isOpen,
  );

  return {
    isOpen,
    setIsOpen,
    selectedValues,
    setSelectedValues,
    dropdownRef,
  };
};
