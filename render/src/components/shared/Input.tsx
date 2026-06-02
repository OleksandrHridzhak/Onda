import React from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    inputSize?: InputSize;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', inputSize = 'md', type = 'text', ...props }, ref) => {
        const baseClass =
            'w-full border border-border bg-background text-text placeholder:text-textSubtle rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primaryColor disabled:opacity-60 disabled:cursor-not-allowed';
        const sizeClasses: Record<InputSize, string> = {
            sm: 'h-10 px-3 py-2',
            md: 'h-[50px] px-4 py-2',
            lg: 'h-14 px-5 py-3',
        };

        return (
            <input
                ref={ref}
                type={type}
                className={`${baseClass} ${sizeClasses[inputSize]} ${className}`.trim()}
                {...props}
            />
        );
    },
);

Input.displayName = 'Input';
