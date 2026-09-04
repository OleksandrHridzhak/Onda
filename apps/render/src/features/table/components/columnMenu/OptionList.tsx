import React from "react";
import { Plus } from "lucide-react";
import { Field } from "shared/ui/Field";
import { Input } from "shared/ui/Input";
import { Button } from "shared/ui/Button";
import { Badge } from "shared/ui/Badge";
import { TagEditModal } from "./TagEditModal";
import type { Tag } from "../../types/columnTypes";
import { COLUMN_TYPES } from "../../types/columnDefinitions";
import { COLOR_STYLES, type ColorName } from "shared/lib/color";

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

export const OptionsList = ({
  columnType,
  tags,
  newOption,
  setNewOption,
  handleAddOption,
  handleRemoveOption,
  handleEditOption,
  handleColorChange,
}: OptionsListProps) => {
  const [activeTag, setActiveTag] = React.useState<Tag | null>(null);

  // Map column type to display label
  const getLabelText = () => {
    switch (columnType) {
      case COLUMN_TYPES.TAGS:
        return "Tags";
      case COLUMN_TYPES.TODO:
        return "Categories";
      case COLUMN_TYPES.MULTI_CHECKBOX:
        return "Checkboxes";
      case COLUMN_TYPES.TASK_TABLE:
        return "Tasks";
      default:
        return "Options";
    }
  };

  // Map column type for placeholder text
  const getPlaceholderType = () => {
    switch (columnType) {
      case COLUMN_TYPES.TAGS:
        return "tag";
      case COLUMN_TYPES.TODO:
        return "category";
      case COLUMN_TYPES.MULTI_CHECKBOX:
        return "checkbox";
      case COLUMN_TYPES.TASK_TABLE:
        return "task";
      default:
        return "option";
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddOption();
                }
              }}
              placeholder={`Add new ${getPlaceholderType()}...`}
              aria-label={`Add new ${getPlaceholderType()}`}
              className="flex-1 h-12"
            />
            <Button
              onClick={handleAddOption}
              size="icon"
              className="w-12 h-12 rounded-xl"
              aria-label="Add new option"
            >
              <Plus size={18} className="stroke-2" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                as="button"
                size="md"
                onClick={() => setActiveTag(tag)}
                colorClasses={COLOR_STYLES[tag.color]}
                aria-label={`Edit ${tag.name}`}
              >
                {tag.name}
              </Badge>
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
