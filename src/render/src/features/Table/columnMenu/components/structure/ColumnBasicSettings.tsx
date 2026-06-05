import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { IconSelector } from 'features/Table/columnMenu/components/ui/IconSelector';
import { TitleVisibilityToggle } from 'features/Table/columnMenu/components/ui/TitleVisibilityToggle';
import { Button } from 'shared/Button';
import { Field } from 'shared/Field';
import { Input } from 'shared/Input';
import { Textarea } from 'shared/Textarea';
import { Icon } from 'app/utils/icons';

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
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
            <Textarea
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                aria-label="Column description"
            />

            {/* Position Controls Section */}
            <Field label="Column Position and Width" className="mb-4">
                <div className="flex space-x-2">
                    <div className="w-full">
                        <Input
                            type="number"
                            value={width}
                            onChange={handleWidthChange}
                            min="0"
                            max="1000"
                            placeholder="Enter width in pixels"
                            aria-label="Column width"
                            inputSize="sm"
                            className="bg-transparent"
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleMoveLeft}
                        disabled={!canMoveLeft}
                    >
                        <ArrowLeft size={18} /> LEFT
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleMoveRight}
                        disabled={!canMoveRight}
                    >
                        RIGHT <ArrowRight size={18} />
                    </Button>
                </div>
            </Field>
        </>
    );
};
