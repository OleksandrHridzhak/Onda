import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
}) => {
    if (!isOpen) return null;

    const handleConfirm = (): void => {
        onConfirm();
        onClose();
    };

    return (
        <div
            role="button"
            tabIndex={-1}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onMouseDown={onClose}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    onClose();
                }
            }}
            aria-label="Close modal"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-md mx-4 rounded-xl shadow-2xl bg-surface text-text border border-border"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg transition-colors text-textMuted hover:bg-backgrundHover hover:text-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-textMuted">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg font-medium transition-colors bg-secondary text-secondaryText hover:bg-secondaryHover"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            variant === 'danger'
                                ? 'bg-danger text-white hover:bg-dangerHover'
                                : 'bg-colorAccent5Solid text-white hover:bg-colorAccent5Hover'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
