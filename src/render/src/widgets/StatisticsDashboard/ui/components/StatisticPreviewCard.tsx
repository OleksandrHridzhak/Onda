import React from 'react';
import type { BaseColumn } from 'entities/Column';
import { getIconComponent } from 'shared/lib/icons';
import { Card } from 'shared/ui/Card';
import { Heading } from 'shared/ui/Heading';

interface StatisticPreviewCardProps {
    column: BaseColumn;
    onClick: () => void;
    children: React.ReactNode;
}

export const StatisticPreviewCard: React.FC<StatisticPreviewCardProps> = ({
    column,
    onClick,
    children,
}) => (
    <Card
        as="button"
        onClick={onClick}
        ariaLabel={`Open statistics for ${column.name}`}
        className="w-fit p-5 text-left transition-all duration-200 hover:border-primaryColor/30 hover:bg-surfaceMuted hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
    >
        <div className="flex items-center gap-2">
            {column.emojiIconName &&
                getIconComponent(column.emojiIconName, 16, 'text-primaryColor')}
            <Heading as="h2" variant="base">
                {column.name}
            </Heading>
        </div>
        <div className="mt-4">{children}</div>
    </Card>
);
