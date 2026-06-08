import React, { useLayoutEffect, useState } from 'react';
import { Button } from 'shared/ui/Button';
import { ColorPicker } from 'shared/ui/ColorPicker';
import { Field } from 'shared/ui/Field';
import { Input } from 'shared/ui/Input';
import { ModalShell } from 'shared/ui/ModalShell';
import { Tag } from 'shared/types/newColumn.types';
import { ColorName } from 'shared/utils/colorOptions';

interface TagEditModalProps {
    tag: Tag | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (tagId: string, newName: string, color: ColorName) => void;
    onDelete: (tagId: string) => void;
}

export const TagEditModal: React.FC<TagEditModalProps> = ({
    tag,
    isOpen,
    onClose,
    onSave,
    onDelete,
}) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState<ColorName>('accent2');

    useLayoutEffect(() => {
        if (!tag) {
            return;
        }

        setName(tag.name);
        setColor(tag.color);
    }, [tag]);

    if (!tag) {
        return null;
    }

    const handleSave = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        onSave(tag.id, trimmedName, color);
        onClose();
    };

    const handleDelete = () => {
        onDelete(tag.id);
        onClose();
    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Edit Tag">
            <div className="space-y-4">
                <Field label="Name" htmlFor="tag-name" required>
                    <Input
                        id="tag-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tag name"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                    />
                </Field>

                <ColorPicker
                    label="Color"
                    value={color}
                    onChange={setColor}
                    layout="grid"
                    shape="square"
                />

                <div className="flex items-center justify-between gap-3 pt-2">
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={!name.trim()}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </ModalShell>
    );
};
