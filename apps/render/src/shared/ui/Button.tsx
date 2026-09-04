import React from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
export type ButtonVariant =
    'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    fullWidth?: boolean;
    title?: string;
    'aria-label'?: string;
}

export function Button({
    children,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
    size = 'md',
    className = '',
    fullWidth = false,
    title,
    'aria-label': ariaLabel,
}: ButtonProps) {
    const variantClass: Record<ButtonVariant, string> = {
        primary: 'bg-primaryColor text-white',
        secondary: 'bg-secondary text-secondaryText',
        danger: 'bg-danger text-white',
        outline:
            'border border-border bg-transparent text-text hover:bg-primaryHover hover:text-white',
        ghost: 'bg-transparent text-text hover:bg-backgrundHover',
    };

    const sizeClass: Record<ButtonSize, string> = {
        sm: 'gap-1.5 px-2.5 py-1 text-xs rounded-lg',
        md: 'gap-3 px-4 py-2.5 text-sm rounded-xl',
        lg: 'gap-3 px-5 py-3 text-base rounded-xl',
        icon: 'gap-0 p-1.5 rounded-lg justify-center',
    };

    const stateClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
    const widthClass = fullWidth ? 'w-full justify-center' : '';
    const baseClass = `inline-flex items-center transition-colors ${widthClass} ${stateClass} ${variantClass[variant]} ${sizeClass[size]}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            title={title}
            aria-label={ariaLabel}
            className={`${baseClass} ${className}`.trim()}
        >
            {children}
        </button>
    );
}
