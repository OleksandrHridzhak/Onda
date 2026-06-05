import React from 'react';
import { componentsMap } from 'features/Table/Table.constants';
import { daysColumn, fillerColumn } from 'features/Table/Table.constants';
import { useLiveQuery } from 'dexie-react-hooks';
import TableItemWrapper from 'features/Table/columns/TableItemWrapper';
import { getAllColumns } from 'db/helpers/columns';
import { getSettings } from 'db/helpers/settings';
import { getEntriesForWeek } from 'db/helpers/columnEntries';
import { ColumnEntryValueMap } from 'app/types/columnEntries.types';
import { getWeekDates, getWeekStartKey } from 'app/utils/date';
import 'features/Table/Table.css';
import { useRowHeightSync } from 'features/Table/hooks/useRowHeightSync';
import DynamicColumn from 'features/Table/columns/DynamicColumn';
import { TableLoadingOverlay } from 'features/Table/components/TableLoadingOverlay';
import { useTableWeek } from 'features/Table/context/TableWeekContext';

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
                                    <componentsMap.days weekDates={weekDates} />
                                </TableItemWrapper>

                                {/* Dynamic: User-defined optional columns */}
                                {columnOrder.map((id) => (
                                    <DynamicColumn
                                        key={id}
                                        columnId={id}
                                        weekDates={weekDates}
                                        weekEntriesByDate={
                                            weekEntriesByBlock[id] || {}
                                        }
                                    />
                                ))}

                                {/* Utility: Filler column to occupy remaining space */}
                                <TableItemWrapper
                                    key="filler"
                                    column={fillerColumn}
                                >
                                    <componentsMap.fillerColumn />
                                </TableItemWrapper>
                            </tr>
                        </thead>
                    </table>
                </div>

                {/* Loading overlay */}
                <TableLoadingOverlay isVisible={isLoading} />
            </div>
        </div>
    );
};
export default Table;
