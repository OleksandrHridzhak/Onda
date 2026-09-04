import React from 'react';
import './WeeklyTable.css';
import DynamicColumn from './DynamicColumn';
import { TableLoadingOverlay } from './common/TableLoadingOverlay';
import { TableEmptyState } from './common/TableEmptyState';
import { DaysColumn } from './columns/service/DaysColumn/DaysColumn';
import { FillerColumn } from './columns/service/FillerColumn/FillerColumn';
import { useWeeklyTable } from '../hooks/useWeeklyTable';

export const WeeklyTable: React.FC = () => {
    const {
        currentWeekStart,
        weekDates,
        visibleColumns,
        weekEntriesByBlock,
        isInitialLoading,
        isLoading,
    } = useWeeklyTable();

    // To avoid rendering issues, ensure required data is loaded
    if (isInitialLoading) {
        return null; // Add a loading skeleton here if needed
    }

    return (
        <div className="font-poppins m-2">
            <div className="overflow-x-auto custom-scroll relative rounded-xl border border-border">
                <table className="w-full">
                    <thead>
                        <tr className="border-border bg-surfaceMuted text-textMuted border-b">
                            {/* Static: Days of the week column */}
                            <DaysColumn />

                            {/* Dynamic: User-defined optional columns */}
                            {visibleColumns.map((column) => (
                                <DynamicColumn
                                    key={column.id}
                                    column={column}
                                    weekDates={weekDates}
                                    weekEntriesByDate={
                                        weekEntriesByBlock[column.id] || {}
                                    }
                                    archivedAt={currentWeekStart}
                                />
                            ))}

                            {/* Utility: Filler column to occupy remaining space */}
                            <FillerColumn
                                hideRowBorders={visibleColumns.length === 0}
                            />
                        </tr>
                    </thead>
                </table>
                {/* Loading overlay */}
                <TableLoadingOverlay isVisible={isLoading} />
                <TableEmptyState
                    isVisible={!isLoading && visibleColumns.length === 0}
                />
            </div>
        </div>
    );
};

export default WeeklyTable;
