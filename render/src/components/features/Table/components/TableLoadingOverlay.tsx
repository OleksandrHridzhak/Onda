import React from 'react';

interface TableLoadingOverlayProps {
    isVisible: boolean;
}

export const TableLoadingOverlay: React.FC<TableLoadingOverlayProps> = ({
    isVisible,
}) => {
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-background transition-opacity duration-300">
            <div className="flex flex-col items-center gap-4">
                {/* Animated circles */}
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primaryColor animate-spin" />
                    <div
                        className="absolute inset-2 rounded-full border-2 border-transparent border-t-primaryColor/50 animate-spin"
                        style={{
                            animationDirection: 'reverse',
                            animationDuration: '1.5s',
                        }}
                    />

                    {/* ONDA text in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold tracking-wider text-primaryColor">
                            ONDA
                        </span>
                    </div>
                </div>

                {/* Loading text */}
                <p className="text-sm font-medium text-textTableValues animate-pulse">
                    Syncing data...
                </p>
            </div>
        </div>
    );
};
