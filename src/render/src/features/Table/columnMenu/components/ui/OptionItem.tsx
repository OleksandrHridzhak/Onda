import React from 'react';
import { COLOR_STYLES } from 'app/utils/colorOptions';
import { Tag } from 'app/types/newColumn.types';

interface OptionItemProps {
    tag: Tag;
    onClick: (tag: Tag) => void;
}

export const OptionItem: React.FC<OptionItemProps> = ({ tag, onClick }) => {
    const selectedColorName = tag.color;
    const colorOption = COLOR_STYLES[selectedColorName];

    return (
        <button
            type="button"
            onClick={() => onClick(tag)}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${colorOption?.bg} ${colorOption?.text || 'text-text'}`}
            aria-label={`Edit ${tag.name}`}
        >
            {tag.name}
        </button>
    );
};
