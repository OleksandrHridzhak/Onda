import { useEffect, useState } from "react";

/**
 * Custom hook to synchronize row heights across multiple table columns.
 * Only syncs tables with multiple rows (excludes single-cell columns like todo/tasktable).
 *
 * @param dependencies - Array of dependencies to trigger resync (e.g., columnsData, columnOrder)
 * @returns { isLoading } - Loading state while syncing
 */
export const useRowHeightSync = (dependencies: React.DependencyList = []) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let innerRafId: number;
    let resizeTimeoutId: number;
    let mutationTimeoutId: number;

    const syncRowHeights = () => {
      const allContainers = document.querySelectorAll(".table-rows-container");
      if (allContainers.length === 0) return;

      // Filter containers with multiple rows (7-day columns: DaysColumn, DayBasedColumn, FillerColumn)
      const containers = Array.from(allContainers).filter(
        (c) => c.querySelectorAll(".table-day-row").length > 1,
      );

      if (containers.length === 0) return;

      // Find maximum number of rows across all containers
      const maxRows = Math.max(
        ...containers.map((c) => c.querySelectorAll(".table-day-row").length),
      );

      // Collect max heights per row
      const maxHeights: number[] = [];

      // For each row index, find and apply maximum height
      for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        const rows: HTMLElement[] = [];

        containers.forEach((c) => {
          const row = c.querySelectorAll(".table-day-row")[
            rowIndex
          ] as HTMLElement;
          if (row) {
            // Reset height first to measure natural height
            row.style.height = "auto";
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
          maxHeights.push(maxHeight);
        } else {
          maxHeights.push(0);
        }
      }

      // Sum max heights to get combined height for single-row columns (todo/tasktable)
      const totalHeight = maxHeights.reduce((a, b) => a + b, 0);

      // Apply total height to .todo-cell so its height matches the combined rows
      if (totalHeight > 0) {
        const todoCells = document.querySelectorAll<HTMLElement>(".todo-cell");
        todoCells.forEach((cell) => {
          cell.style.minHeight = `${totalHeight}px`;
        });
      }

      // Delay marking loading as complete to allow browser paint
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Defer sync until after DOM has been painted
    // Use double requestAnimationFrame to ensure all async-loaded columns
    // have rendered before measuring (after async data loading)
    const outerRafId = requestAnimationFrame(() => {
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

    const tables = document.querySelectorAll(".checkbox-nested-table");
    tables.forEach((table) => observer.observe(table));

    return () => {
      cancelAnimationFrame(outerRafId);
      cancelAnimationFrame(innerRafId);
      clearTimeout(resizeTimeoutId);
      clearTimeout(mutationTimeoutId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { isLoading };
};
