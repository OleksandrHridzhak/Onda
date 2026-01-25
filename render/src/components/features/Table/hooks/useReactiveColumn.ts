import { useLiveQuery } from 'dexie-react-hooks';
import { getColumnById } from '../../../../db/helpers/columns';
import { Column } from '../../../../types/newColumn.types';

/**
 * useReactiveColumn
 * combines a live subscription to IndexedDB - because of DRY principles.
 * with automatic type validation for a specific column - becasue of TS limitations.
 */
export function useReactiveColumn<T extends Column>(
    columnId: string,
    expectedType: Column['type'],
) {
    const column = useLiveQuery(async () => {
        const res = await getColumnById(columnId);

        // Ensure the record exists in the database
        if (!res || !res.success) return null;

        // Runtime Type Guard: prevents the UI from rendering
        // with the wrong column data type.
        if (res.data.type !== expectedType) {
            console.error(
                `Onda Architecture Error: Component expected "${expectedType}", ` +
                    `but database returned "${res.data.type}".`,
            );
            return null;
        }

        return res.data as T;
    }, [columnId]);

    // State definitions:
    // undefined -> data is still being fetched (Initial Loading)
    // null      -> an error occurred or type mismatch was found
    const isLoading = column === undefined;
    const isError = column === null && !isLoading;

    return { column, isLoading, isError };
}
