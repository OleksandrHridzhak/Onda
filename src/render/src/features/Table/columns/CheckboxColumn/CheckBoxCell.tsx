import React from 'react';
import { Check } from 'lucide-react';
import { COLOR_STYLES, ColorName } from 'shared/utils/colorOptions';

interface CheckboxCellProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    color?: ColorName;
}

/**
 * A controlled circular checkbox cell for the task table.
 * Uses the shared color palette from colorOptions.
 */
export const CheckboxCell: React.FC<CheckboxCellProps> = ({
    checked,
    onChange,
    color = 'accent1',
}) => {
    const colorClasses = COLOR_STYLES[color] || COLOR_STYLES.accent1;

    return (
        <div className="flex justify-center items-center w-full h-full">
            <label className="relative flex items-center justify-center w-6 h-6 cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange(!checked)}
                    className="sr-only peer"
                />
                <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center 
                        transition-all duration-150 ease-in-out
                        border-transparent
                        ${checked ? colorClasses.solid : ''}
                        ${checked ? colorClasses.hover : 'hover:border-border'}`}
                >
                    <Check
                        size={16}
                        className={`absolute text-white transition-opacity duration-150 ${
                            checked ? 'opacity-100' : 'opacity-0'
                        }`}
                        strokeWidth={3}
                    />
                </div>
            </label>
        </div>
    );
};
