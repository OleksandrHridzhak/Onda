import React from 'react';

interface FieldProps {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    htmlFor?: string;
    className?: string;
    children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
    label,
    hint,
    error,
    required = false,
    htmlFor,
    className = '',
    children,
}) => {
    return (
        <div className={`space-y-1 ${className}`.trim()}>
            {label ? (
                <label
                    htmlFor={htmlFor}
                    className="block text-sm font-medium text-textMuted"
                >
                    {label}
                    {required ? (
                        <span className="ml-1 text-danger">*</span>
                    ) : null}
                </label>
            ) : null}

            {children}

            {error ? (
                <p className="text-xs text-danger">{error}</p>
            ) : hint ? (
                <p className="text-xs text-textSubtle">{hint}</p>
            ) : null}
        </div>
    );
};
