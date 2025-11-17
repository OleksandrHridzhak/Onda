import React, { createContext, useContext, ReactNode } from 'react';
import { BaseColumn } from '../../../models/columns/BaseColumn';

/**
 * Column Context - Provides column operations without prop drilling
 * 
 * This context makes column operations available to any component in the tree
 * without having to pass props through every level.
 */

interface ColumnOperations {
  // Column manipulation
  handleRename: (id: string, newName: string) => Promise<any>;
  handleDeleteColumn: (id: string) => Promise<any>;
  handleClearColumn: (id: string) => Promise<any>;
  handleChangeIcon: (id: string, newIcon: string) => Promise<any>;
  handleChangeDescription: (id: string, newDescription: string) => Promise<any>;
  handleToggleTitleVisibility: (id: string, visible: boolean) => Promise<any>;
  handleChangeOptions: (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[]
  ) => Promise<any>;
  handleChangeCheckboxColor: (id: string, color: string) => Promise<any>;
  handleMoveColumn: (id: string, direction: 'up' | 'down') => Promise<void>;
  handleChangeWidth: (id: string, width: number | string) => Promise<void>;
  
  // Cell operations
  handleCellChange: (day: string, columnId: string, value: unknown) => Promise<void>;
  
  // Column data
  columns: BaseColumn[];
  tableData: Record<string, Record<string, unknown>>;
}

const ColumnContext = createContext<ColumnOperations | null>(null);

interface ColumnProviderProps {
  children: ReactNode;
  operations: ColumnOperations;
}

/**
 * Provider component that makes column operations available to child components
 */
export const ColumnProvider: React.FC<ColumnProviderProps> = ({
  children,
  operations,
}) => {
  return (
    <ColumnContext.Provider value={operations}>
      {children}
    </ColumnContext.Provider>
  );
};

/**
 * Hook to access column operations from any component
 * 
 * @example
 * const { handleRename, handleDeleteColumn } = useColumnContext();
 * await handleRename(columnId, 'New Name');
 */
export const useColumnContext = (): ColumnOperations => {
  const context = useContext(ColumnContext);
  if (!context) {
    throw new Error('useColumnContext must be used within ColumnProvider');
  }
  return context;
};
