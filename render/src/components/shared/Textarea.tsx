import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', ...props }, ref) => {
        const baseClass =
            'w-full px-4 py-2 border border-border bg-background text-text placeholder:text-textSubtle rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primaryColor disabled:opacity-60 disabled:cursor-not-allowed resize-none';

        return (
            <textarea
                ref={ref}
                className={`${baseClass} ${className}`.trim()}
                {...props}
            />
        );
    },
);

Textarea.displayName = 'Textarea';
