import React from 'react';
import { Button } from 'shared/ui/Button';
import { useState } from 'react';
import { ConfirmModal } from 'shared/ui/ConfirmModal';

interface ColumnActionsProps {
    handleDelete: () => void;
    handleClear: () => void;
    handleSave: () => void;
    isSaving: boolean;
}

export const ColumnActions: React.FC<ColumnActionsProps> = ({
    handleDelete,
    handleClear,
    handleSave,
    isSaving,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="flex justify-between gap-2 mt-6">
            <div className="flex gap-2">
                <Button
                    onClick={() => setShowConfirm(true)}
                    disabled={isSaving}
                    variant="danger"
                >
                    Delete
                </Button>
                <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleDelete}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this column? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />
                <Button
                    onClick={handleClear}
                    disabled={isSaving}
                    variant="secondary"
                >
                    Clear column
                </Button>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
                Save Changes
            </Button>
        </div>
    );
};
