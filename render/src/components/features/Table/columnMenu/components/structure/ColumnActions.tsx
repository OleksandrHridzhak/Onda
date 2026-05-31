import React from 'react';
import { Button } from '../../../../../shared/Button';

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
    return (
        <div className="flex justify-between gap-2 mt-6">
            <div className="flex gap-2">
                <Button
                    onClick={handleDelete}
                    disabled={isSaving}
                    variant="danger"
                >
                    Delete
                </Button>
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
