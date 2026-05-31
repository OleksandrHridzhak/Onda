import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    className?: string;
    fullWidth?: boolean;
}

export function Button({
    children,
    onClick,
    disabled = false,
    variant = 'primary',
    className = '',
    fullWidth = false,
}: ButtonProps) {
    const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
        primary: 'bg-primaryColor text-white',
        secondary: 'bg-secondary text-secondaryText',
        danger: 'bg-danger text-white',
        outline:
            'border border-border bg-transparent text-text hover:bg-primaryHover hover:text-white',
        ghost: 'bg-transparent text-text hover:bg-backgrundHover',
    };

    const stateClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
    const widthClass = fullWidth ? 'w-full justify-center' : '';
    const baseClass = `flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-colors ${widthClass} ${stateClass} ${variantClass[variant]}`;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${className}`.trim()}
        >
            {children}
        </button>
    );
}
