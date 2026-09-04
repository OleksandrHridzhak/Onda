import React from 'react';

export interface BadgeProps {
    as?: 'span' | 'button' | 'div';
    children: React.ReactNode;
    colorClasses?: { bg?: string; text?: string };
    size?: 'sm' | 'md';
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    'aria-label'?: string;
}

export function Badge({
    as = 'span',
    children,
    colorClasses,
    size = 'sm',
    className = '',
    onClick,
    'aria-label': ariaLabel,
}: BadgeProps): React.ReactElement {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs font-medium',
    };

    const colorClass = colorClasses
        ? `${colorClasses.bg || 'bg-secondary'} ${colorClasses.text || 'text-text'}`
        : 'bg-secondary text-text';

    const baseClass = `inline-flex items-center rounded-full font-medium transition-opacity ${sizeClasses[size]} ${colorClass}`;

    if (as === 'button') {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={ariaLabel}
                className={`${baseClass} hover:opacity-80 cursor-pointer ${className}`.trim()}
            >
                {children}
            </button>
        );
    }

    if (as === 'div') {
        return (
            <div className={`${baseClass} ${className}`.trim()}>{children}</div>
        );
    }

    return (
        <span className={`${baseClass} ${className}`.trim()}>{children}</span>
    );
}
