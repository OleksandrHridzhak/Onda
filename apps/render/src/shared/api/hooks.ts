import { useState, useEffect } from 'react';
import { api } from './client';
import type {
    DbChangeEvent,
    Column,
    ColumnEntry,
    CalendarEntry,
    Setting,
} from '@onda/shared';

export function useDbQuery<T>(
    queryFn: () => Promise<T>,
    tables: ('columns' | 'entries' | 'calendar' | 'settings' | 'all')[],
    depsKey = '',
): T | undefined {
    const [data, setData] = useState<T | undefined>(undefined);
    const tablesKey = tables.join(',');

    useEffect(() => {
        let isCurrent = true;

        const runQuery = async () => {
            try {
                const result = await queryFn();
                if (isCurrent) {
                    setData(result);
                }
            } catch (error) {
                console.error('[useDbQuery Error]:', error);
            }
        };

        void runQuery();

        const watchedTables = tablesKey.split(',') as (
            'columns' | 'entries' | 'calendar' | 'settings' | 'all'
        )[];
        const unsubscribe = api.onDbChange((event: DbChangeEvent) => {
            if (
                watchedTables.includes(event.table) ||
                event.table === 'all' ||
                watchedTables.includes('all')
            ) {
                void runQuery();
            }
        });

        return () => {
            isCurrent = false;
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depsKey, tablesKey]);

    return data;
}

export function useColumns(): Column[] {
    const data = useDbQuery(async () => {
        const res = await api.columns.getAll();
        return res.success && res.data ? res.data : [];
    }, ['columns']);
    return data || [];
}

export function useWeekEntries(weekStart: string): ColumnEntry[] {
    const data = useDbQuery(
        async () => {
            if (!weekStart) return [];
            const res = await api.entries.getEntriesForWeek(weekStart);
            return res.success && res.data ? res.data : [];
        },
        ['entries', 'columns'],
        weekStart,
    );
    return data || [];
}

export function useCalendarEvents(): CalendarEntry[] {
    const data = useDbQuery(async () => {
        const res = await api.calendar.getAll();
        return res.success && res.data ? res.data : [];
    }, ['calendar']);
    return data || [];
}

export function useSettings(): Setting | undefined {
    const data = useDbQuery(async () => {
        const res = await api.settings.get();
        return res.success && res.data ? res.data : undefined;
    }, ['settings']);
    return data;
}
