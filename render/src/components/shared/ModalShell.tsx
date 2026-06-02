import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Heading } from './Heading';

interface ModalShellProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: React.ReactNode;
    className?: string;
}

export function ModalShell({
    isOpen,
    onClose,
    children,
    title,
    className = 'cursor-default',
}: ModalShellProps) {
    if (!isOpen) return null;

    const handleBackdropMouseDown = () => {
        onClose();
    };

    const handlePanelMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={`fixed inset-0 z-[9999] flex items-center justify-center ${className}`.trim()}
            onMouseDown={handleBackdropMouseDown}
            onKeyDown={handleKeyDown}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div
                className="relative z-10 w-full max-w-md mx-4"
                onMouseDown={handlePanelMouseDown}
            >
                <div className="rounded-2xl bg-background border-border border shadow-md p-4 text-text">
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
                    <div>{children}</div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
