import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { IconSelector } from './IconSelector';
import { TitleVisibilityToggle } from './TitleVisibilityToggle';
import { TransparentBtn } from '../../../../shared/TransparentBtn';
import { Icon } from '../../../../../utils/icons';

interface ColumnBasicSettingsProps {
    // Name input props
    name: string;
    setName: (value: string) => void;
    selectedIcon: string;
    setSelectedIcon: (value: string) => void;
    showTitle: boolean;
    setShowTitle: (value: boolean) => void;
    isIconSectionExpanded: boolean;
    setIsIconSectionExpanded: () => void;
    icons: Icon[];
    
    // Description props
    description: string;
    setDescription: (value: string) => void;
    
    // Position controls props
    width: number;
    handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    canMoveLeft: boolean;
    canMoveRight: boolean;
    handleMoveLeft: () => void;
    handleMoveRight: () => void;
    
    darkMode: boolean;
}

export const ColumnBasicSettings: React.FC<ColumnBasicSettingsProps> = ({
    name,
    setName,
    selectedIcon,
    setSelectedIcon,
    showTitle,
    setShowTitle,
    isIconSectionExpanded,
    setIsIconSectionExpanded,
    icons,
    description,
    setDescription,
    width,
    handleWidthChange,
    canMoveLeft,
    canMoveRight,
    handleMoveLeft,
    handleMoveRight,
    darkMode,
}) => {
    return (
        <>
            {/* Name Input Section */}
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

            {/* Description Section */}
            <textarea
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200 resize-none`}
                rows={3}
                aria-label="Column description"
            />

            {/* Position Controls Section */}
            <div className="mb-4">
                <label
                    className={`block text-sm font-medium text-textTableValues mb-1`}
                >
                    Column Position and Width
                </label>
                <div className="flex space-x-2">
                    <div className="w-full">
                        <input
                            type="number"
                            value={width}
                            onChange={handleWidthChange}
                            min="0"
                            max="1000"
                            className={`w-full px-3 py-2.5 flex items-center text-sm border bg-transparent border-border text-text rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primaryColor`}
                            placeholder="Enter width in pixels"
                            aria-label="Column width"
                        />
                    </div>
                    <TransparentBtn
                        onClick={handleMoveLeft}
                        disabled={!canMoveLeft}
                        darkTheme={darkMode}
                    >
                        <ArrowLeft size={18} /> LEFT
                    </TransparentBtn>
                    <TransparentBtn
                        onClick={handleMoveRight}
                        disabled={!canMoveRight}
                        darkTheme={darkMode}
                    >
                        RIGHT <ArrowRight size={18} />
                    </TransparentBtn>
                </div>
            </div>
        </>
    );
};
