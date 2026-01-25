import { useState, useEffect, useRef } from 'react';

interface DropdownMultiSelectState {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedValues: string[];
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
    dropdownRef: React.RefObject<HTMLDivElement>;
}

/**
 * Generic multi-select dropdown hook used by Tags and MultiCheckbox columns.
 */
export const useDropdownMultiSelect = (
    value: string,
): DropdownMultiSelectState => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(
        typeof value === 'string' && value.trim() !== ''
            ? value.split(', ').filter((v) => v.trim() !== '')
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
        selectedValues,
        setSelectedValues,
        dropdownRef,
    };
};
