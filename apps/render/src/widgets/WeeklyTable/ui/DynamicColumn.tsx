import React from 'react';
import TableItemWrapper from './TableItemWrapper';
import { ColumnEntryValueMap } from 'entities/ColumnEntry';
import type { Column } from 'entities/Column';
import { CheckboxColumn } from './columns/CheckboxColumn';
import { MultiCheckboxColumn } from './columns/MultiCheckboxColumn';
import { NumberboxColumn } from './columns/NumberboxColumn';
import { TagsColumn } from './columns/TagsColumn';
import { TaskTableColumn } from './columns/TaskTableColumn';
import { TextboxColumn } from './columns/TextboxColumn';
import { TodoColumn } from './columns/TodoColumn';

/**
 * DynamicColumn component that subscribes only to its own column data.
 *
 * This optimization prevents unnecessary re-renders of all columns
 * when only one column's data changes. Each column instance subscribes
 * directly to its specific database record using useLiveQuery.
 *
 * @param columnId - Unique identifier of the column to render
 */
const DynamicColumn: React.FC<{
    column: Column;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}> = ({ column, weekDates, weekEntriesByDate, archivedAt }) => {
    const commonProps = { weekDates, weekEntriesByDate, archivedAt };
    let content: React.ReactNode;

    switch (column.type) {
        case 'checkboxColumn':
            content = <CheckboxColumn column={column} {...commonProps} />;
            break;
        case 'numberboxColumn':
            content = <NumberboxColumn column={column} {...commonProps} />;
            break;
        case 'tagsColumn':
            content = <TagsColumn column={column} {...commonProps} />;
            break;
        case 'textboxColumn':
            content = <TextboxColumn column={column} {...commonProps} />;
            break;
        case 'multiCheckBoxColumn':
            content = <MultiCheckboxColumn column={column} {...commonProps} />;
            break;
        case 'todoListColumn':
            content = <TodoColumn column={column} archivedAt={archivedAt} />;
            break;
        case 'taskTableColumn':
            content = (
                <TaskTableColumn column={column} archivedAt={archivedAt} />
            );
            break;
    }

    return (
        <TableItemWrapper column={column} className="border-r border-border">
            {content}
        </TableItemWrapper>
    );
};

export default DynamicColumn;
