import React from "react";
import "./WeeklyTable.css";
import { DynamicColumns } from "./columns/DynamicColumns";
import { LoadingScreen } from "shared/ui/LoadingScreen";
import { EmptyState } from "shared/ui/EmptyState";
import { Columns3 } from "lucide-react";
import { DaysColumn } from "./columns/service/DaysColumn";
import { FillerColumn } from "./columns/service/FillerColumn";
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
        {isLoading && (
          <div className="absolute inset-0 z-50">
            <LoadingScreen message="Syncing data..." />
          </div>
        )}
        {!isLoading && visibleColumns.length === 0 && (
          <div className="absolute inset-x-0 bottom-0 top-[45px] z-40 rounded-b-lg bg-background/95">
            <EmptyState
              icon={<Columns3 size={28} strokeWidth={1.5} />}
              title="No columns for this week"
              description="Use the + button in the sidebar to add your first column."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTable;
