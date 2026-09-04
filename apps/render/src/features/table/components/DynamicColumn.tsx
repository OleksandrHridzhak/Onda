import React from 'react';
import { ColumnWrapper } from './columns/shared/ColumnWrapper';
import type { Column } from '../types/columnTypes';
import { COLUMN_TYPES } from '../types/columnDefinitions';
import type { ColumnEntryValueMap } from '../types/entryTypes';
import { DayBasedColumn } from './columns/DayBasedColumn';
import { FullWeekColumn } from './columns/FullWeekColumn';

const FULL_WEEK_COLUMN_TYPES = new Set<string>([
    COLUMN_TYPES.TODO,
    COLUMN_TYPES.TASK_TABLE,
]);

export interface DynamicColumnProps {
    column: Column;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}

/**
 * DynamicColumn routes to one of the 2 shared column layouts:
 * - FullWeekColumn for single-cell weekly columns (Todo, TaskTable)
 * - DayBasedColumn for 7-cell daily columns (Checkbox, Numberbox, Textbox, Tags, MultiCheckbox)
 */
export const DynamicColumn = ({
    column,
    weekDates,
    weekEntriesByDate,
    archivedAt,
}: DynamicColumnProps) => {
    return (
        <ColumnWrapper column={column} className="border-r border-border">
            {FULL_WEEK_COLUMN_TYPES.has(column.type) ? (
                <FullWeekColumn column={column} archivedAt={archivedAt} />
            ) : (
                <DayBasedColumn
                    column={column}
                    weekDates={weekDates}
                    weekEntriesByDate={weekEntriesByDate}
                    archivedAt={archivedAt}
                />
            )}
        </ColumnWrapper>
    );
};

export default DynamicColumn;
