import React from "react";
import "./WeeklyTable.css";
import { DynamicColumns } from "./DynamicColumns";
import { TableLoadingOverlay } from "./TableLoadingOverlay";
import { TableEmptyState } from "./TableEmptyState";
import { DaysColumn } from "./columns/service/DaysColumn/DaysColumn";
import { FillerColumn } from "./columns/service/FillerColumn/FillerColumn";
import { useWeeklyTable } from "../hooks/useWeeklyTable";

export const WeeklyTable = () => {
  const { visibleColumns, weekEntriesByBlock, isInitialLoading, isLoading } =
    useWeeklyTable();

  // To avoid rendering issues, ensure required data is loaded
  if (isInitialLoading) {
    return null;
  }

  return (
    <div className="weekly-table-root font-poppins m-2">
      <div className="relative rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-border bg-surfaceMuted text-textMuted border-b">
                {/* Static: Days of the week column */}
                <DaysColumn />

                {/* Dynamic: User-defined optional columns */}
                <DynamicColumns
                  columns={visibleColumns}
                  weekEntriesByBlock={weekEntriesByBlock}
                />

                {/* Utility: Filler column to occupy remaining space */}
                <FillerColumn hideRowBorders={visibleColumns.length === 0} />
              </tr>
            </thead>
          </table>
        </div>
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
