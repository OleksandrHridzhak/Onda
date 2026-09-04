import React from 'react';
import { useDbQuery, useColumns, useWeekEntries } from 'shared/api/db';
import { getSettings } from 'features/settings/api/settings';
import type { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import type { Column } from '../types/columnTypes';
import { getWeekDates, getWeekStartKey } from 'shared/lib/date';
import { useRowHeightSync } from './useRowHeightSync';
import { useTableWeek } from 'features/table/context/TableWeekContext';
import { isColumnVisibleForWeek } from '../utils/lifecycle';

export function useWeeklyTable() {
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

    const visibleColumns = React.useMemo(() => {
        if (!columnOrder || !columnsData) return [];

        const columnsById = new Map(
            columnsData.map((column) => [column.id, column]),
        );

        return columnOrder
            .map((id) => columnsById.get(id))
            .filter(
                (column): column is Column =>
                    column !== undefined &&
                    isColumnVisibleForWeek(column, currentWeekStartKey),
            );
    }, [columnOrder, columnsData, currentWeekStartKey]);

    const visibleColumnOrder = React.useMemo(
        () => visibleColumns.map((c) => c.id),
        [visibleColumns],
    );

    // Synchronize row heights across all nested tables
    const { isLoading: isSyncingRowHeight } = useRowHeightSync([
        columnsData,
        weekEntries,
    ]);

    const isInitialLoading =
        columnOrder === undefined ||
        columnsData === undefined ||
        weekEntries === undefined;

    return {
        currentWeekStart,
        weekDates,
        columnsData,
        visibleColumns,
        visibleColumnOrder,
        weekEntriesByBlock,
        isInitialLoading,
        isLoading: isSyncingRowHeight,
    };
}
