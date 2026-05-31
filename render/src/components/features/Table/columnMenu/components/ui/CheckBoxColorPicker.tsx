import React from 'react';
import {
    COLOR_ORDER,
    COLOR_STYLES,
    ColorName,
} from '../../../../../../utils/colorOptions';

interface CheckboxColorPickerProps {
    checkboxColor: ColorName;
    setCheckboxColor: (color: ColorName) => void;
    toggleColorMenu: () => void;
}

export const CheckboxColorPicker: React.FC<CheckboxColorPickerProps> = ({
    checkboxColor,
    setCheckboxColor,
    toggleColorMenu,
}) => {
    const selectedColorName = checkboxColor;

    return (
        <div className="mb-4">
            <label className={`block text-sm font-medium text-textMuted mb-1`}>
                Checkbox Color
            </label>
            <div className="">
                <div
                    className={` mt-2 bg-background border-border text-text border rounded-lg p-2 z-10`}
                >
                    <div className="flex flex-wrap gap-2 max-h-32 ">
                        {COLOR_ORDER.map((colorName) => (
                            <button
                                key={colorName}
                                onClick={() => {
                                    setCheckboxColor(colorName);
                                    toggleColorMenu();
                                }}
                                className={`w-6 h-6 rounded-full ${COLOR_STYLES[colorName].bg} ${COLOR_STYLES[colorName].text} border ${selectedColorName === colorName ? 'ring-2 ring-offset-2 ring-primaryColor' : 'border-transparent'} hover:ring-1 hover:ring-border transition-all duration-200`}
                                aria-label={`Select ${colorName} color`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
