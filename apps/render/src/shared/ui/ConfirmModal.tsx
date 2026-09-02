import React from 'react';
import { ModalShell } from 'shared/ui/ModalShell';
import { Button } from 'shared/ui/Button';
import { Text } from 'shared/ui/Text';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) => {
    if (!isOpen) return null;

    const handleConfirm = (): void => {
        onConfirm();
        onClose();
    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title={title}>
            <div className="p-3">
                <Text tone="muted">{message}</Text>
            </div>

            <div className="flex justify-end gap-3">
                <Button onClick={onClose} variant="secondary">
                    {cancelText}
                </Button>
                <Button onClick={handleConfirm} variant="danger">
                    {confirmText}
                </Button>
            </div>
        </ModalShell>
    );
};
