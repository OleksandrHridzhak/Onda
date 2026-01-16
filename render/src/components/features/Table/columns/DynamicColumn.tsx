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
 */
const DynamicColumn: React.FC<{ columnId: string }> = ({ columnId }) => {
    // Each column subscribes ONLY to its own record
    const data = useLiveQuery(() => db.tableColumns.get(columnId));

    if (!data) return null;

    const Component = componentsMap[data.type];
    if (!Component) return null;

    return (
        <TableItemWrapper column={data} className="border-r border-border">
            <Component columnId={columnId} />
        </TableItemWrapper>
    );
};

export default DynamicColumn;
