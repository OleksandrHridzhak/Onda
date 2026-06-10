import React from 'react';

interface CardProps {
    as?: 'div' | 'button';
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    ariaLabel?: string;
    ariaPressed?: boolean;
}

export function Card({
    as = 'div',
    children,
    className = '',
    onClick,
    ariaLabel,
    ariaPressed,
}: CardProps): React.ReactElement {
    const classes =
        `rounded-xl border border-border bg-surface ${className}`.trim();

    if (as === 'button') {
        return (
            <button
                type="button"
                className={classes}
                onClick={onClick}
                aria-label={ariaLabel}
                aria-pressed={ariaPressed}
            >
                {children}
            </button>
        );
    }

    return <div className={classes}>{children}</div>;
}
