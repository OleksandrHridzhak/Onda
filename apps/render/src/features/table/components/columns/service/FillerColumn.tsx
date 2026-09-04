import React from "react";
import { DAYS } from "../../../utils/tableLayout";
import { ColumnWrapper } from "../shared/ColumnWrapper";

/**
 * A column component that displays the empty space of the table.
 * ! Always exists at the right side of the table if there are no any other columns.
 */
interface FillerColumnProps {
  hideRowBorders?: boolean;
}

export const FillerColumn = ({ hideRowBorders = false }: FillerColumnProps) => {
  return (
    <ColumnWrapper>
      <div className="checkbox-nested-table font-poppins flex flex-col h-full w-full">
        <div className="h-[45px] box-border border-b border-border bg-surfaceMuted" />
        <div className="table-rows-container bg-surface flex flex-col w-full">
          {DAYS.map((day, idx) => (
            <div
              key={day}
              className={`table-day-row box-border ${
                idx !== DAYS.length - 1
                  ? `border-b ${
                      hideRowBorders ? "border-transparent" : "border-border"
                    }`
                  : ""
              }`}
              style={{ height: "60px" }}
            />
          ))}
        </div>
      </div>
    </ColumnWrapper>
  );
};

export default FillerColumn;
