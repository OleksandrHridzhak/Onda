import React from 'react';
import { daysColumn, fillerColumn } from '../model/constants';
import { useLiveQuery } from 'dexie-react-hooks';
import TableItemWrapper from './TableItemWrapper';
import { getAllColumns } from 'entities/Column';
import { getSettings } from 'entities/Settings';
import { getEntriesForWeek } from 'entities/ColumnEntry';
import { ColumnEntryValueMap } from 'entities/ColumnEntry';
import { getWeekDates, getWeekStartKey } from 'shared/lib/date';
import './WeeklyTable.css';
import { useRowHeightSync } from '../lib/useRowHeightSync';
import DynamicColumn from './DynamicColumn';
import { TableLoadingOverlay } from './components/TableLoadingOverlay';
import { TableEmptyState } from './components/TableEmptyState';
import { useTableWeek } from 'features/ChangeTableWeek';
import { isColumnVisibleForWeek } from 'entities/Column';
import { DaysColumn } from './columns/DaysColumn';
import FillerColumn from './FillerColumn';

const Table: React.FC = () => {
    const { currentWeekStart } = useTableWeek();
    const currentWeekStartKey = React.useMemo(
        () => getWeekStartKey(currentWeekStart),
        [currentWeekStart],
    );
    const weekDates = React.useMemo(
        () => getWeekDates(currentWeekStart),
        [currentWeekStart],
    );

    /**
     * Fetch the ordered list of column IDs from the settings.
     * This determines the visual sequence of columns in the table.
     */
    const columnOrder = useLiveQuery(async () => {
        const res = await getSettings();
        return res?.data?.layout?.columnsOrder ?? [];
    });

    /**
     * Fetch all column data objects from the database.
     * Required as a dependency for useRowHeightSync to recalculate
     * row heights when column content or configuration changes.
     */
    const columnsData = useLiveQuery(async () => {
        const res = await getAllColumns();
        return res.success ? res.data : [];
    });

    const weekEntries = useLiveQuery(async () => {
        const res = await getEntriesForWeek(currentWeekStartKey);
        return res.success ? res.data : [];
    }, [currentWeekStartKey]);

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

    /**
     * ARCHITECTURE NOTE:
     * We use nested tables for each column instead of standard cell rendering.
     * This provides each column type with structural independence.
     * * Structure:
     * <MainTable>
     * <Row>
     * <DaysColumn (Nested Table) />
     * <DynamicColumns (Nested Tables) />
     * <FillerColumn (Nested Table) />
     * </Row>
     * </MainTable>
     */
    return (
        <div className="font-poppins m-2">
            <div className="overflow-x-auto custom-scroll relative rounded-xl border border-border">
                <div className="overflow-x-auto custom-scroll">
                    <table className="w-full">
                        <thead>
                            <tr className="border-border bg-surfaceMuted text-textMuted border-b">
                                {/* Static: Days of the week column */}
                                <TableItemWrapper
                                    key="days-column"
                                    column={daysColumn}
                                    className="border-r border-border"
                                >
                                    <DaysColumn weekDates={weekDates} />
                                </TableItemWrapper>

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
                                <TableItemWrapper
                                    key="filler"
                                    column={fillerColumn}
                                >
                                    <FillerColumn
                                        hideRowBorders={
                                            visibleColumnOrder.length === 0
                                        }
                                    />
                                </TableItemWrapper>
                            </tr>
                        </thead>
                    </table>
                </div>

                {/* Loading overlay */}
                <TableLoadingOverlay isVisible={isLoading} />
                <TableEmptyState
                    isVisible={!isLoading && visibleColumnOrder.length === 0}
                />
            </div>
        </div>
    );
};
export default Table;
