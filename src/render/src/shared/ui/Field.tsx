import React from 'react';
import { Text } from './Text';

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
                <Text variant="caption" tone="danger">
                    {error}
                </Text>
            ) : hint ? (
                <Text variant="caption" tone="subtle">
                    {hint}
                </Text>
            ) : null}
        </div>
    );
};
