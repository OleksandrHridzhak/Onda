import React from 'react';
import { getWidthStyle } from 'features/columns/utils/tableLayout';

interface ColumnWrapperProps {
    column?: { id?: string; width?: number };
    width?: number;
    className?: string;
    children?: React.ReactNode;
}

export const ColumnWrapper: React.FC<ColumnWrapperProps> = ({
    column,
    width,
    className,
    children,
}) => {
    const widthStyle =
        width !== undefined
            ? { width: `${width}px`, minWidth: `${width}px` }
            : column
              ? getWidthStyle(column)
              : {};

    return (
        <th
            key={column?.id}
            style={{
                ...widthStyle,
                padding: 0,
                verticalAlign: 'top',
            }}
            className={className}
        >
            {children}
        </th>
    );
};

export default ColumnWrapper;
