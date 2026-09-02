import type React from 'react';

export const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export const getWidthStyle = (column: {
    width: number;
}): React.CSSProperties => {
    return { width: `${column.width}px`, minWidth: `${column.width}px` };
};
