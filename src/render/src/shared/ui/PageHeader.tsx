import React from 'react';
import { Heading } from 'shared/ui/Heading';

interface PageHeaderProps {
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    icon,
    children,
    className = '',
}: PageHeaderProps): React.ReactElement {
    return (
        <div
            className={`sticky top-0 z-20 bg-surface border-b border-border ${className}`.trim()}
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex flex-row items-center justify-between gap-2 flex-nowrap">
                <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                    <div className="hidden sm:flex p-2 sm:p-3 rounded-2xl bg-primaryColor text-sidebarIconActive items-center justify-center">
                        {icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <Heading as="h1" variant="xl">
                            {title}
                        </Heading>
                    </div>
                </div>
                {children ? (
                    <div className="flex items-center gap-1 sm:gap-3 w-full sm:w-auto justify-end">
                        {children}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
