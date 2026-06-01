import React from 'react';
import {
    COLOR_ORDER,
    COLOR_STYLES,
    type ColorName,
} from '../../utils/colorOptions';

interface ColorPickerProps {
    value: ColorName;
    onChange: (color: ColorName) => void;
    label?: string;
    layout?: 'row' | 'grid';
    shape?: 'circle' | 'square';
    className?: string;
    onSelect?: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    value,
    onChange,
    label,
    layout = 'row',
    shape = 'square',
    className = '',
    onSelect,
}) => {
    const layoutClass =
        layout === 'grid'
            ? 'grid w-full grid-cols-[repeat(auto-fit,minmax(1.5rem,1fr))] gap-2 max-h-32'
            : 'grid w-full grid-cols-5 gap-2 sm:grid-cols-10';

    const shapeClass =
        shape === 'square'
            ? layout === 'grid'
                ? 'w-full aspect-square rounded-lg'
                : 'w-full aspect-square rounded-lg'
            : 'w-6 h-6 rounded-full';

    const baseWrapperClass =
        layout === 'grid'
            ? 'mt-2 bg-background border border-border rounded-lg p-2'
            : '';

    return (
        <div className={`w-full ${className}`.trim()}>
            {label && (
                <label className="block text-sm font-medium text-textMuted mb-1">
                    {label}
                </label>
            )}
            <div className={baseWrapperClass}>
                <div className={layoutClass}>
                    {COLOR_ORDER.map((colorName) => {
                        const selectedClass =
                            value === colorName
                                ? 'ring-2 ring-offset-2 ring-primaryColor'
                                : layout === 'grid'
                                  ? 'border-transparent'
                                  : '';

                        return (
                            <button
                                key={colorName}
                                type="button"
                                onClick={() => {
                                    onChange(colorName);
                                    onSelect?.();
                                }}
                                className={`${shapeClass} ${COLOR_STYLES[colorName].solid} border ${selectedClass} hover:ring-1 hover:ring-border transition-all duration-200`}
                                aria-label="Select color"
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
