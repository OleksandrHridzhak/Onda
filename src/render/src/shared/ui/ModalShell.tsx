import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Heading } from 'shared/ui/Heading';

interface ModalShellProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: React.ReactNode;
    className?: string;
    size?: 'default' | 'large';
}

export function ModalShell({
    isOpen,
    onClose,
    children,
    title,
    className = 'cursor-default',
    size = 'default',
}: ModalShellProps) {
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleBackdropMouseDown = () => {
        onClose();
    };

    const handlePanelMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    const panelSizeClass =
        size === 'large'
            ? 'h-[80vh] w-[80vw] max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)]'
            : 'w-full max-w-md mx-4';

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={`fixed inset-0 z-[9999] flex items-center justify-center ${className}`.trim()}
            onMouseDown={handleBackdropMouseDown}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div
                className={`relative z-10 ${panelSizeClass}`}
                onMouseDown={handlePanelMouseDown}
            >
                <div
                    className={`flex rounded-2xl bg-background border-border border shadow-md p-4 text-text ${
                        size === 'large' ? 'h-full flex-col' : 'flex-col'
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Heading as="h1" variant="lg" className="font-semibold">
                            {title}
                        </Heading>
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="p-1 rounded-full text-textMuted hover:bg-backgrundHover transition-colors duration-200"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div
                        className={
                            size === 'large'
                                ? 'custom-scroll min-h-0 flex-1 overflow-y-auto'
                                : ''
                        }
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
