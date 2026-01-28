import React from 'react';
import { IconSelector } from './IconSelector';
import { TitleVisibilityToggle } from './TitleVisibilityToggle';
import { Icon } from '../../../../../utils/icons';

interface ColumnNameInputProps {
    name: string;
    setName: (value: string) => void;
    selectedIcon: string;
    setSelectedIcon: (value: string) => void;
    showTitle: boolean;
    setShowTitle: (value: boolean) => void;
    isIconSectionExpanded: boolean;
    setIsIconSectionExpanded: () => void;
    icons: Icon[];
    darkMode: boolean;
}

export const ColumnNameInput: React.FC<ColumnNameInputProps> = ({
    name,
    setName,
    selectedIcon,
    setSelectedIcon,
    showTitle,
    setShowTitle,
    isIconSectionExpanded,
    setIsIconSectionExpanded,
    icons,
    darkMode,
}) => {
    return (
        <div className="flex gap-2 w-full">
            <IconSelector
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
                isIconSectionExpanded={isIconSectionExpanded}
                setIsIconSectionExpanded={setIsIconSectionExpanded}
                icons={icons}
                darkMode={darkMode}
            />
            <div className="w-full flex relative">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full h-[50px] px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200`}
                    placeholder="Column name"
                    aria-label="Column name"
                />
                <TitleVisibilityToggle
                    showTitle={showTitle}
                    setShowTitle={setShowTitle}
                    darkMode={darkMode}
                />
            </div>
        </div>
    );
};
