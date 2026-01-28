import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { TransparentBtn } from '../../../../shared/TransparentBtn';

interface ColumnPositionControlsProps {
    width: number;
    handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    canMoveLeft: boolean;
    canMoveRight: boolean;
    handleMoveLeft: () => void;
    handleMoveRight: () => void;
    darkMode: boolean;
}

export const ColumnPositionControls: React.FC<ColumnPositionControlsProps> = ({
    width,
    handleWidthChange,
    canMoveLeft,
    canMoveRight,
    handleMoveLeft,
    handleMoveRight,
    darkMode,
}) => {
    return (
        <div className="mb-4">
            <label
                className={`block text-sm font-medium text-textTableValues mb-1`}
            >
                Column Position and width
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
    );
};
