import React from 'react';
import { Button } from '../../../../../shared/Button';
import { Field } from '../../../../../shared/Field';
import { Input } from '../../../../../shared/Input';
import { ModalShell } from '../../../../../shared/ModalShell';
import { Select } from '../../../../../shared/Select';
import { Tag } from '../../../../../../types/newColumn.types';

interface TodoEditModalProps {
    isOpen: boolean;
    editText: string;
    editCategoryId: string;
    availableCategories: Tag[];
    setEditText: (text: string) => void;
    setEditCategoryId: (categoryId: string) => void;
    onClose: () => void;
    onSave: () => void;
}

export const TodoEditModal: React.FC<TodoEditModalProps> = ({
    isOpen,
    editText,
    editCategoryId,
    availableCategories,
    setEditText,
    setEditCategoryId,
    onClose,
    onSave,
}) => {
    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Edit Todo">
            <div className="space-y-4">
                <Field label="Task" htmlFor="todo-edit-text" required>
                    <Input
                        id="todo-edit-text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Todo text"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSave();
                            }
                        }}
                    />
                </Field>

                {availableCategories.length > 0 && (
                    <Field label="Category" htmlFor="todo-edit-category">
                        <Select
                            id="todo-edit-category"
                            value={editCategoryId}
                            onChange={(e) => setEditCategoryId(e.target.value)}
                            inputSize="sm"
                        >
                            <option value="">No category</option>
                            {availableCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </Field>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave} disabled={!editText.trim()}>
                        Save
                    </Button>
                </div>
            </div>
        </ModalShell>
    );
};
