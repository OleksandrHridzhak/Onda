import React from 'react';
import { Check } from 'lucide-react';
import { CHECKBOX_COLORS } from './checkboxColors';

interface CheckboxCellProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    color?: string;
}

/**
 * A controlled circular checkbox cell for the task table.
 * Uses Tailwind classes for theming via the CHECKBOX_COLORS constant.
 */
export const CheckboxCell: React.FC<CheckboxCellProps> = ({
    checked,
    onChange,
    color = 'green',
}) => {
    const colorClasses = CHECKBOX_COLORS[color] || CHECKBOX_COLORS.green;

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
                        ${checked ? colorClasses.bg : ''}
                        ${checked ? colorClasses.hover : 'hover:border-gray-400'}`}
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
