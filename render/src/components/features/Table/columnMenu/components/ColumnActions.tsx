import React from 'react';
import { BubbleBtn } from '../../../../shared/BubbleBtn';

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
                <BubbleBtn
                    onClick={handleDelete}
                    disabled={isSaving}
                    variant="delete"
                >
                    Delete
                </BubbleBtn>
                <BubbleBtn
                    onClick={handleClear}
                    disabled={isSaving}
                    variant="clear"
                >
                    Clear column
                </BubbleBtn>
            </div>
            <BubbleBtn
                onClick={handleSave}
                disabled={isSaving}
                variant="standard"
            >
                Save Changes
            </BubbleBtn>
        </div>
    );
};
