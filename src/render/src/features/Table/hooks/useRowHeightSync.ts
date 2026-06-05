import { useEffect, useState } from 'react';

/**
 * Custom hook to synchronize row heights across multiple table columns.
 * Only syncs tables with multiple rows (excludes single-cell columns like todo/tasktable).
 *
 * @param dependencies - Array of dependencies to trigger resync (e.g., columnsData, columnOrder)
 * @returns { isLoading } - Loading state while syncing
 */
export const useRowHeightSync = (dependencies: any[]) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let outerRafId: number;
        let innerRafId: number;
        let resizeTimeoutId: number;
        let mutationTimeoutId: number;

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

            // Delay marking loading as complete to allow browser paint
            // This ensures the UI has time to render the size changes
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        };

        // Defer sync until after DOM has been painted
        // Use double requestAnimationFrame to ensure all async-loaded columns
        // have rendered before measuring (after Dexie async data loading)
        outerRafId = requestAnimationFrame(() => {
            innerRafId = requestAnimationFrame(() => {
                syncRowHeights();
            });
        });

        // Add MutationObserver to detect DOM changes (for page switching)
        const mutationObserver = new MutationObserver(() => {
            clearTimeout(mutationTimeoutId);
            mutationTimeoutId = window.setTimeout(() => {
                syncRowHeights();
            }, 150); // Debounce mutations to batch changes
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: false,
            attributes: false,
        });

        // Add ResizeObserver to track size changes (with debouncing to prevent infinite loop)
        const observer = new ResizeObserver(() => {
            clearTimeout(resizeTimeoutId);
            resizeTimeoutId = window.setTimeout(() => {
                syncRowHeights();
            }, 100); // Debounce by 100ms to batch resize events
        });

        const tables = document.querySelectorAll('.checkbox-nested-table');
        tables.forEach((table) => observer.observe(table));

        return () => {
            cancelAnimationFrame(outerRafId);
            cancelAnimationFrame(innerRafId);
            clearTimeout(resizeTimeoutId);
            clearTimeout(mutationTimeoutId);
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, dependencies);

    return { isLoading };
};
