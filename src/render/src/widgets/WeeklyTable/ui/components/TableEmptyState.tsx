import React from 'react';
import { Columns3 } from 'lucide-react';
import { Heading } from 'shared/ui/Heading';

interface TableEmptyStateProps {
    isVisible: boolean;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
    isVisible,
}) => {
    if (!isVisible) return null;

    return (
        <div className="absolute inset-x-0 bottom-0 top-[45px] z-40 flex items-center justify-center rounded-b-lg bg-background/95">
            <div className="flex max-w-sm flex-col items-center gap-3 px-8 py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-primaryColor/10 text-primaryColor">
                    <Columns3 size={28} strokeWidth={1.5} />
                </div>
                <div>
                    <Heading as="h2" variant="base">
                        No columns for this week
                    </Heading>
                    <p className="mt-1 text-sm text-textMuted">
                        Use the + button in the sidebar to add your first
                        column.
                    </p>
                </div>
            </div>
        </div>
    );
};
