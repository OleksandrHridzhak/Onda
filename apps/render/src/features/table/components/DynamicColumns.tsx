import React from 'react';
import { ColumnWrapper } from './columns/shared/ColumnWrapper';
import { DayBasedColumn } from './columns/DayBasedColumn';
import { FullWeekColumn } from './columns/FullWeekColumn';
import { COLUMN_TYPES } from '../types/columnDefinitions';
import type { Column } from '../types/columnTypes';
import type { ColumnEntryValueMap } from '../types/entryTypes';
import { useTableWeek } from '../hooks/useTableWeek';

const FULL_WEEK_COLUMN_TYPES = new Set<string>([
    COLUMN_TYPES.TODO,
    COLUMN_TYPES.TASK_TABLE,
]);

export interface DynamicColumnsProps {
    columns: Column[];
    weekEntriesByBlock: Record<string, ColumnEntryValueMap>;
}

/**
 * DynamicColumns component
 * Responsible for rendering the dynamic core of user-defined columns.
 * Maps over visible columns and routes each to DayBasedColumn or FullWeekColumn inside ColumnWrapper.
 */
export const DynamicColumns = ({
    columns,
    weekEntriesByBlock,
}: DynamicColumnsProps) => {
    const { weekDates, currentWeekStart } = useTableWeek();

    return (
        <>
            {columns.map((column) => (
                <ColumnWrapper
                    key={column.id}
                    column={column}
                    className="border-r border-border"
                >
                    {FULL_WEEK_COLUMN_TYPES.has(column.type) ? (
                        <FullWeekColumn
                            column={column}
                            archivedAt={currentWeekStart}
                        />
                    ) : (
                        <DayBasedColumn
                            column={column}
                            weekDates={weekDates}
                            weekEntriesByDate={
                                weekEntriesByBlock[column.id] || {}
                            }
                            archivedAt={currentWeekStart}
                        />
                    )}
                </ColumnWrapper>
            ))}
        </>
    );
};

export default DynamicColumns;
