import React from 'react';
import { COLOR_STYLES } from 'shared/lib/color';
import type { Tag } from '../../types/columnTypes';
import { Badge } from 'shared/ui/Badge';

interface OptionItemProps {
    tag: Tag;
    onClick: (tag: Tag) => void;
}

export const OptionItem: React.FC<OptionItemProps> = ({ tag, onClick }) => {
    const selectedColorName = tag.color;
    const colorOption = COLOR_STYLES[selectedColorName];

    return (
        <Badge
            as="button"
            size="md"
            onClick={() => onClick(tag)}
            colorClasses={colorOption}
            aria-label={`Edit ${tag.name}`}
        >
            {tag.name}
        </Badge>
    );
};
