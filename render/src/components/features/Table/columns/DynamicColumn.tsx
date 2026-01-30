import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../db';
import { componentsMap } from '../Table.constants';
import TableItemWrapper from './TableItemWrapper';

/**
 * DynamicColumn component that subscribes only to its own column data.
 *
 * This optimization prevents unnecessary re-renders of all columns
 * when only one column's data changes. Each column instance subscribes
 * directly to its specific database record using useLiveQuery.
 *
 * @param columnId - Unique identifier of the column to render
 * @param isCompletedToday - Whether this column is completed for today (affects styling)
 */
const DynamicColumn: React.FC<{
    columnId: string;
    isCompletedToday?: boolean;
}> = ({ columnId, isCompletedToday = false }) => {
    // Each column subscribes ONLY to its own record
    const data = useLiveQuery(() => db.tableColumns.get(columnId));

    if (!data) return null;

    const Component = componentsMap[data.type];
    if (!Component) return null;

    // Apply blur and dark styling for completed columns
    const completedClassName = isCompletedToday
        ? 'opacity-50 blur-[0.5px] dark:opacity-40'
        : '';

    return (
        <TableItemWrapper
            column={data}
            className={`border-r border-border ${completedClassName}`}
        >
            <Component columnId={columnId} />
        </TableItemWrapper>
    );
};

export default DynamicColumn;
