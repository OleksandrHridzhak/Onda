import React from 'react';

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    inputSize?: SelectSize;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', inputSize = 'md', ...props }, ref) => {
        const baseClass =
            'w-full border border-border bg-background text-text rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor disabled:opacity-60 disabled:cursor-not-allowed';
        const sizeClasses: Record<SelectSize, string> = {
            sm: 'h-10 px-3 py-2',
            md: 'h-[50px] px-4 py-2',
            lg: 'h-14 px-5 py-3',
        };

        return (
            <select
                ref={ref}
                className={`${baseClass} ${sizeClasses[inputSize]} ${className}`.trim()}
                {...props}
            />
        );
    },
);

Select.displayName = 'Select';
