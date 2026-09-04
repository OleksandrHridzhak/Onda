import React from 'react';
import { ColumnWrapper } from './columns/shared/ColumnWrapper';
import { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import type { Column } from 'features/columns/types/types';
import { COLUMN_TYPES } from 'features/columns/types/definitions';
import { CheckboxColumn } from './columns/CheckboxColumn/CheckboxColumn';
import { MultiCheckboxColumn } from './columns/MultiCheckboxColumn/MultiCheckboxColumn';
import { NumberboxColumn } from './columns/NumberboxColumn/NumberboxColumn';
import { TagsColumn } from './columns/TagsColumn/TagsColumn';
import { TaskTableColumn } from './columns/TaskTableColumn/TaskTableColumn';
import { TextboxColumn } from './columns/TextboxColumn/TextboxColumn';
import { TodoColumn } from './columns/TodoColumn/TodoColumn';

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
        case COLUMN_TYPES.CHECKBOX:
            content = <CheckboxColumn column={column} {...commonProps} />;
            break;
        case COLUMN_TYPES.NUMBERBOX:
            content = <NumberboxColumn column={column} {...commonProps} />;
            break;
        case COLUMN_TYPES.TAGS:
            content = <TagsColumn column={column} {...commonProps} />;
            break;
        case COLUMN_TYPES.TEXTBOX:
            content = <TextboxColumn column={column} {...commonProps} />;
            break;
        case COLUMN_TYPES.MULTI_CHECKBOX:
            content = <MultiCheckboxColumn column={column} {...commonProps} />;
            break;
        case COLUMN_TYPES.TODO:
            content = <TodoColumn column={column} archivedAt={archivedAt} />;
            break;
        case COLUMN_TYPES.TASK_TABLE:
            content = (
                <TaskTableColumn column={column} archivedAt={archivedAt} />
            );
            break;
    }

    return (
        <ColumnWrapper column={column} className="border-r border-border">
            {content}
        </ColumnWrapper>
    );
};

export default DynamicColumn;
