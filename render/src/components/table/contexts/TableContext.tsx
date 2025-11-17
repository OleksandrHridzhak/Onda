import React, { createContext, useContext, ReactNode } from 'react';

interface Column {
  id: string;
  name: string;
  type: string;
  emojiIcon?: string;
  nameVisible?: boolean;
  width?: number;
  description?: string;
  options?: string[];
  doneTags?: string[];
  tagColors?: Record<string, string>;
  checkboxColor?: string;
}

interface TableData {
  [day: string]: {
    [columnId: string]: unknown;
  };
}

interface TableContextValue {
  // Column operations
  handleRename: (id: string, newName: string) => void;
  handleDeleteColumn: (id: string) => void;
  handleClearColumn: (id: string) => void;
  handleChangeIcon: (id: string, newIcon: string) => void;
  handleChangeDescription: (id: string, newDescription: string) => void;
  handleToggleTitleVisibility: (id: string, visible: boolean) => void;
  handleChangeOptions: (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => void;
  handleChangeCheckboxColor: (id: string, color: string) => void;
  handleMoveColumn: (id: string, direction: 'up' | 'down') => void;
  handleChangeWidth: (id: string, width: number) => void;

  // Cell operations
  handleCellChange: (day: string, columnId: string, value: unknown) => void;

  // Table data
  columns: Column[];
  tableData: TableData;
}

const TableContext = createContext<TableContextValue | undefined>(undefined);

interface TableProviderProps {
  children: ReactNode;
  value: TableContextValue;
}

export const TableProvider: React.FC<TableProviderProps> = ({
  children,
  value,
}) => {
  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};

export const useTableContext = (): TableContextValue => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};
