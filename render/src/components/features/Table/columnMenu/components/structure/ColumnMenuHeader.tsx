import React from 'react';
import { X } from 'lucide-react';

interface ColumnMenuHeaderProps {
    onClose: () => void;
}

export const ColumnMenuHeader: React.FC<ColumnMenuHeaderProps> = ({
    onClose,
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg z-55 font-semibold text-text`}>
                Column Settings
            </h2>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                aria-label="Close column settings"
                className={`p-1 rounded-full text-textTableValues hover:bg-hoverBg transition-colors duration-200`}
            >
                <X size={20} />
            </button>
        </div>
    );
};
