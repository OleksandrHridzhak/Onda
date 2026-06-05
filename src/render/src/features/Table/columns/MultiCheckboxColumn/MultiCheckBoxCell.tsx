import React from 'react';
import { useDropdownMultiSelect } from 'features/Table/columns/hooks/useDropdownMultiSelect';
import { useCircleCanvas } from 'features/Table/columns/MultiCheckboxColumn/useCircleCanvas';
import {
    getColorForTag,
    handleOptionToggle,
} from 'features/Table/columns/MultiCheckboxColumn/logic';
import { Tag } from 'app/types/newColumn.types';
import { ColumnEntrySnapshot } from 'app/types/columnEntries.types';

interface MultiCheckboxCellProps {
    selectedOptionIds: string[];
    onChange: (optionIds: string[]) => void;
    availableOptions: Tag[];
    selectedSnapshots?: ColumnEntrySnapshot[];
}

/**
 * MultiCheckboxCell component
 * Displays a circular indicator with multiple color segments.
 * Works directly with Tag objects and IDs (no name-based operations).
 */
export const MultiCheckboxCell: React.FC<MultiCheckboxCellProps> = ({
    selectedOptionIds,
    onChange,
    availableOptions,
    selectedSnapshots = [],
}) => {
    const getSnapshotById = (optionId: string) => {
        return selectedSnapshots.find((option) => option.id === optionId);
    };

    // Convert selected IDs to display value for useDropdownMultiSelect
    const displayValue = selectedOptionIds
        .map(
            (id) =>
                availableOptions.find((opt) => opt.id === id)?.name ||
                getSnapshotById(id)?.name,
        )
        .filter(Boolean)
        .join(', ');

    const { isOpen, setIsOpen, setSelectedValues, dropdownRef } =
        useDropdownMultiSelect(displayValue);

    const { canvasRef, colorOptions, colorOrder } = useCircleCanvas(
        selectedOptionIds,
        availableOptions,
    );

    return (
        <div
            className="relative flex justify-center items-center"
            ref={dropdownRef}
        >
            {/* Clean circular indicator */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
                className="cursor-pointer  flex items-center justify-center w-8 h-8 hover:opacity-80 transition-opacity"
                aria-label="Select options"
                aria-expanded={isOpen}
            >
                <canvas
                    ref={canvasRef}
                    width={32}
                    height={32}
                    style={{ width: '32px', height: '32px' }}
                />
            </div>

            {isOpen && (
                <div
                    className="absolute z-10 mt-2 w-48 bg-surface text-text border border-border rounded-lg max-h-64 overflow-auto"
                    style={{ top: '100%' }}
                >
                    {availableOptions.map((option, index) => {
                        const color = getColorForTag(option, index, colorOrder);
                        const colorOption =
                            colorOptions[color] || colorOptions.accent1;
                        const isSelected = selectedOptionIds.includes(
                            option.id,
                        );

                        return (
                            <div
                                key={option.id}
                                role="button"
                                tabIndex={0}
                                className={`px-3 py-2 ${'hover:bg-backgrundHover'} cursor-pointer text-sm flex items-center`}
                                onClick={() =>
                                    handleOptionToggle(
                                        option.id,
                                        selectedOptionIds,
                                        onChange,
                                        availableOptions,
                                        selectedSnapshots,
                                        setSelectedValues,
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleOptionToggle(
                                            option.id,
                                            selectedOptionIds,
                                            onChange,
                                            availableOptions,
                                            selectedSnapshots,
                                            setSelectedValues,
                                        );
                                    }
                                }}
                                aria-label={`Toggle ${option.name}`}
                            >
                                <div
                                    className={`w-3 h-3 rounded-full mr-3 ${colorOption.bg} ${
                                        isSelected
                                            ? 'opacity-100'
                                            : 'opacity-30'
                                    }`}
                                />
                                <span className="flex-1">{option.name}</span>
                                {isSelected && (
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
