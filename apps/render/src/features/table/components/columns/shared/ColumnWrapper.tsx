import React from "react";
import { getWidthStyle } from "../../../utils/tableLayout";

interface ColumnWrapperProps {
  column?: { id?: string; width?: number };
  width?: number;
  className?: string;
  children?: React.ReactNode;
}

export const ColumnWrapper = ({
  column,
  width,
  className,
  children,
}: ColumnWrapperProps) => {
  const widthStyle =
    width !== undefined
      ? { width: `${width}px`, minWidth: `${width}px` }
      : column
        ? getWidthStyle(column)
        : {};

  return (
    <th
      key={column?.id}
      style={{
        ...widthStyle,
        padding: 0,
        verticalAlign: "top",
        height: "100%",
      }}
      className={className}
    >
      {children}
    </th>
  );
};

export default ColumnWrapper;
