import { useEffect } from 'react';

/**
 * Custom hook to synchronize row heights across multiple table columns.
 * Only syncs tables with multiple rows (excludes single-cell columns like todo/tasktable).
 *
 * @param dependencies - Array of dependencies to trigger resync (e.g., columnsData, columnOrder)
 */
export const useRowHeightSync = (dependencies: any[]) => {
    useEffect(() => {
        let outerRafId: number;
        let innerRafId: number;

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

            // Collect max heights per row so we can compute total height for single-row tables
            const maxHeights: number[] = [];

            // For each row index, find and apply maximum height
            for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
                const rows: HTMLElement[] = [];

                tables.forEach((tbody) => {
                    const row = tbody.querySelectorAll('tr')[
                        rowIndex
                    ] as HTMLElement;
                    if (row) {
                        // Reset height first to measure natural height
                        row.style.height = 'auto';
                        rows.push(row);
                    }
                });

                // Find maximum height among all rows with this index
                if (rows.length > 0) {
                    const maxHeight = Math.max(
                        ...rows.map((row) => row.offsetHeight),
                    );
                    // Apply maximum height to all rows
                    rows.forEach((row) => {
                        row.style.height = `${maxHeight}px`;
                    });
                    maxHeights.push(maxHeight);
                } else {
                    maxHeights.push(0);
                }
            }

            // Sum max heights to get combined height for single-row tables (todo/tasktable)
            const totalHeight = maxHeights.reduce((a, b) => a + b, 0);

            // Apply total height to any single-row table so its single row matches the combined height
            Array.from(allTables).forEach((tbody) => {
                const rows = tbody.querySelectorAll('tr');
                if (rows.length === 1) {
                    const row = rows[0] as HTMLElement;
                    row.style.height = `${totalHeight}px`;
                }
            });
        };

        // Defer sync until after DOM has been painted
        // Use double requestAnimationFrame to ensure all async-loaded columns
        // have rendered before measuring (after Dexie async data loading)
        outerRafId = requestAnimationFrame(() => {
            innerRafId = requestAnimationFrame(() => {
                syncRowHeights();
            });
        });

        // Add ResizeObserver to track size changes
        const observer = new ResizeObserver(() => {
            syncRowHeights();
        });

        const tables = document.querySelectorAll('.checkbox-nested-table');
        tables.forEach((table) => observer.observe(table));

        return () => {
            cancelAnimationFrame(outerRafId);
            cancelAnimationFrame(innerRafId);
            observer.disconnect();
        };
    }, dependencies);
};
