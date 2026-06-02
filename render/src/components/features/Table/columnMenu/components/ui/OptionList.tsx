import React from 'react';
import { Plus } from 'lucide-react';
import { Field } from '../../../../../shared/Field';
import { Input } from '../../../../../shared/Input';
import { OptionItem } from './OptionItem';
import { TagEditModal } from './TagEditModal';
import { Tag } from '../../../../../../types/newColumn.types';
import { ColorName } from '../../../../../../utils/colorOptions';

interface OptionsListProps {
    columnType: string;
    tags: Tag[];
    newOption: string;
    setNewOption: (value: string) => void;
    handleAddOption: () => void;
    handleRemoveOption: (tagId: string) => void;
    handleEditOption: (tagId: string, newName: string) => void;
    handleColorChange: (tagId: string, color: ColorName) => void;
}

export const OptionsList: React.FC<OptionsListProps> = ({
    columnType,
    tags,
    newOption,
    setNewOption,
    handleAddOption,
    handleRemoveOption,
    handleEditOption,
    handleColorChange,
}) => {
    const [activeTag, setActiveTag] = React.useState<Tag | null>(null);

    // Map column type to display label
    const getLabelText = () => {
        switch (columnType) {
            case 'tagsColumn':
                return 'Tags';
            case 'todoListColumn':
                return 'Categories';
            case 'multiCheckBoxColumn':
                return 'Checkboxes';
            case 'taskTableColumn':
                return 'Tasks';
            default:
                return 'Options';
        }
    };

    // Map column type for placeholder text
    const getPlaceholderType = () => {
        switch (columnType) {
            case 'tagsColumn':
                return 'tag';
            case 'todoListColumn':
                return 'category';
            case 'multiCheckBoxColumn':
                return 'checkbox';
            case 'taskTableColumn':
                return 'task';
            default:
                return 'option';
        }
    };

    return (
        <>
            <Field label={getLabelText()} className="mb-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Input
                            type="text"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === 'Enter' && handleAddOption()
                            }
                            placeholder={`Add new ${getPlaceholderType()}...`}
                            aria-label={`Add new ${getPlaceholderType()}`}
                            className="flex-1 h-12"
                        />
                        <button
                            onClick={handleAddOption}
                            className={`flex items-center justify-center w-12 h-12 rounded-xl bg-primaryColor hover:bg-primaryHover text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor`}
                            aria-label="Add new option"
                        >
                            <Plus size={18} className="stroke-2" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {tags.map((tag) => (
                            <OptionItem
                                key={tag.id}
                                tag={tag}
                                onClick={setActiveTag}
                            />
                        ))}
                    </div>
                </div>
            </Field>

            <TagEditModal
                tag={activeTag}
                isOpen={activeTag !== null}
                onClose={() => setActiveTag(null)}
                onSave={(tagId, newName, color) => {
                    handleEditOption(tagId, newName);
                    handleColorChange(tagId, color);
                }}
                onDelete={handleRemoveOption}
            />
        </>
    );
};
