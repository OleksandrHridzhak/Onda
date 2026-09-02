import React from 'react';

type TextElement = 'p' | 'span' | 'div';

interface TextProps {
    as?: TextElement;
    variant?: 'body' | 'caption';
    tone?: 'default' | 'muted' | 'subtle' | 'danger';
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
    body: 'text-sm',
    caption: 'text-xs',
};

const toneClasses: Record<NonNullable<TextProps['tone']>, string> = {
    default: 'text-text',
    muted: 'text-textMuted',
    subtle: 'text-textSubtle',
    danger: 'text-danger',
};

export function Text({
    as: Component = 'p',
    variant = 'body',
    tone = 'default',
    children,
    className = '',
    style,
}: TextProps): React.ReactElement {
    return (
        <Component
            className={`${variantClasses[variant]} ${toneClasses[tone]} ${className}`.trim()}
            style={style}
        >
            {children}
        </Component>
    );
}
