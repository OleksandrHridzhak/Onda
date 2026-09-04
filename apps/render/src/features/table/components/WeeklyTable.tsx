import React from 'react';
import { useDbQuery, useColumns, useWeekEntries } from 'shared/api/db';
import { getSettings } from 'features/settings/api/settings';
import type { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import { getWeekDates, getWeekStartKey } from 'shared/lib/date';
import './WeeklyTable.css';
import { useRowHeightSync } from '../hooks/useRowHeightSync';
import DynamicColumn from './DynamicColumn';
import { TableLoadingOverlay } from './common/TableLoadingOverlay';
import { TableEmptyState } from './common/TableEmptyState';
import { useTableWeek } from 'features/table/context/TableWeekContext';
import { isColumnVisibleForWeek } from 'features/columns/utils/lifecycle';
import { DaysColumn } from './columns/service/DaysColumn/DaysColumn';
import { FillerColumn } from './columns/service/FillerColumn/FillerColumn';

export const WeeklyTable: React.FC = () => {
    const { currentWeekStart } = useTableWeek();
    const currentWeekStartKey = React.useMemo(
        () => getWeekStartKey(currentWeekStart),
        [currentWeekStart],
    );
    const weekDates = React.useMemo(
        () => getWeekDates(currentWeekStart),
        [currentWeekStart],
    );

    const columnOrder = useDbQuery(async () => {
        const res = await getSettings();
        return res?.data?.layout?.columnsOrder ?? [];
    }, ['settings', 'columns']);

    const columnsData = useColumns();
    const weekEntries = useWeekEntries(currentWeekStartKey);

    const weekEntriesByBlock = React.useMemo(() => {
        return (weekEntries || []).reduce<Record<string, ColumnEntryValueMap>>(
            (acc, entry) => {
                acc[entry.columnId] ??= {};
                acc[entry.columnId][entry.dateKey] = entry;
                return acc;
            },
            {},
        );
    }, [weekEntries]);

    const visibleColumnOrder = React.useMemo(() => {
        if (!columnOrder || !columnsData) return [];

        const columnsById = new Map(
            columnsData.map((column) => [column.id, column]),
        );

        return columnOrder.filter((id) => {
            const column = columnsById.get(id);
            return (
                column && isColumnVisibleForWeek(column, currentWeekStartKey)
            );
        });
    }, [columnOrder, columnsData, currentWeekStartKey]);

    // Synchronize row heights across all nested tables
    const { isLoading } = useRowHeightSync([columnsData, weekEntries]);

    // To avoid rendering issues, ensure required data is loaded
    if (
        columnOrder === undefined ||
        columnsData === undefined ||
        weekEntries === undefined
    ) {
        return null; // Add a loading skeleton here if needed
    }

    return (
        <div className="font-poppins m-2">
            <div className="overflow-x-auto custom-scroll relative rounded-xl border border-border">
                <table className="w-full">
                    <thead>
                        <tr className="border-border bg-surfaceMuted text-textMuted border-b">
                            {/* Static: Days of the week column */}
                            <DaysColumn weekDates={weekDates} />

                            {/* Dynamic: User-defined optional columns */}
                            {visibleColumnOrder.map((id) => {
                                const column = columnsData.find(
                                    (item) => item.id === id,
                                );
                                return column ? (
                                    <DynamicColumn
                                        key={id}
                                        column={column}
                                        weekDates={weekDates}
                                        weekEntriesByDate={
                                            weekEntriesByBlock[id] || {}
                                        }
                                        archivedAt={currentWeekStart}
                                    />
                                ) : null;
                            })}

                            {/* Utility: Filler column to occupy remaining space */}
                            <FillerColumn
                                hideRowBorders={visibleColumnOrder.length === 0}
                            />
                        </tr>
                    </thead>
                </table>
                {/* Loading overlay */}
                <TableLoadingOverlay isVisible={isLoading} />
                <TableEmptyState
                    isVisible={!isLoading && visibleColumnOrder.length === 0}
                />
            </div>
        </div>
    );
};

export default WeeklyTable;
