import React from 'react';

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
    as?: HeadingElement;
    variant?: 'xs' | 's' | 'base' | 'lg' | 'xl' | '2xl';
    children: React.ReactNode;
    className?: string;
}

const headingVariants: Record<NonNullable<HeadingProps['variant']>, string> = {
    xs: 'text-xs font-medium text-text',
    s: 'text-sm font-medium text-text',
    base: 'text-base font-medium text-text',
    lg: 'text-lg font-medium text-text',
    xl: 'text-xl font-semibold text-text',
    '2xl': 'text-2xl font-semibold text-text',
};

export function Heading({
    as: Component = 'h2',
    variant = 'lg',
    children,
    className = '',
}: HeadingProps) {
    return (
        <Component
            className={`${headingVariants[variant]} ${className}`.trim()}
        >
            {children}
        </Component>
    );
}
