import { useEffect } from 'react';

/**
 * Custom hook to synchronize row heights across multiple table columns.
 * Only syncs tables with multiple rows (excludes single-cell columns like todo/tasktable).
 *
 * @param dependencies - Array of dependencies to trigger resync (e.g., columnsData, columnOrder)
 */
export const useRowHeightSync = (dependencies: any[]) => {
  useEffect(() => {
    const syncRowHeights = () => {
      const allTables = document.querySelectorAll(
        '.checkbox-nested-table tbody',
      );
      if (allTables.length === 0) return;

      // Filter only tables with multiple rows (excludes todo, tasktable)
      const tables = Array.from(allTables).filter(
        (tbody) => tbody.querySelectorAll('tr').length > 1,
      );

      if (tables.length === 0) return;

      // Find maximum number of rows across all tables
      const maxRows = Math.max(
        ...tables.map((tbody) => tbody.querySelectorAll('tr').length),
      );

      // For each row index, find and apply maximum height
      for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        const rows: HTMLElement[] = [];

        tables.forEach((tbody) => {
          const row = tbody.querySelectorAll('tr')[rowIndex] as HTMLElement;
          if (row) {
            // Reset height first to measure natural height
            row.style.height = 'auto';
            rows.push(row);
          }
        });

        // Find maximum height among all rows with this index
        if (rows.length > 0) {
          const maxHeight = Math.max(...rows.map((row) => row.offsetHeight));
          // Apply maximum height to all rows
          rows.forEach((row) => {
            row.style.height = `${maxHeight}px`;
          });
        }
      }
    };

    // Trigger sync when data changes
    syncRowHeights();

    // Add ResizeObserver to track size changes
    const observer = new ResizeObserver(() => {
      syncRowHeights();
    });

    const tables = document.querySelectorAll('.checkbox-nested-table');
    tables.forEach((table) => observer.observe(table));

    return () => {
      observer.disconnect();
    };
  }, dependencies);
};
