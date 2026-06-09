import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3 } from 'lucide-react';
import { COLUMN_TYPES } from 'entities/Column';
import type { ColumnEntry } from 'entities/ColumnEntry';
import type { CheckboxColumn, NumberBoxColumn } from 'entities/Column';
import { formatDateKey } from 'shared/lib/date';
import { getEntriesForDateRange } from 'entities/ColumnEntry';
import { getAllColumns } from 'entities/Column';
import { CheckboxCard } from './CheckboxCard';
import { NumberboxCard } from './NumberboxCard';
import { PageHeader } from 'shared/ui/PageHeader';

interface ColumnStatistics {
    column: CheckboxColumn | NumberBoxColumn;
    entries: ColumnEntry[];
}

function getRecentDays(): Date[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysCount = 112;

    return Array.from({ length: daysCount }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - index);
        return date;
    });
}

export default function StatisticsPage(): React.ReactElement {
    const dates = useMemo(() => getRecentDays(), []);
    const startDate = '0000-01-01';
    const endDate = formatDateKey(dates[0]);

    const statistics = useLiveQuery<ColumnStatistics[]>(async () => {
        const [columnsResult, entriesResult] = await Promise.all([
            getAllColumns(),
            getEntriesForDateRange(startDate, endDate),
        ]);

        if (!columnsResult.success || !entriesResult.success) {
            return [];
        }

        const statisticColumns = columnsResult.data.filter(
            (column): column is CheckboxColumn | NumberBoxColumn =>
                column.type === COLUMN_TYPES.CHECKBOX ||
                column.type === COLUMN_TYPES.NUMBERBOX,
        );
        const entriesByColumn = new Map<string, ColumnEntry[]>();

        entriesResult.data.forEach((entry) => {
            const columnEntries = entriesByColumn.get(entry.columnId) ?? [];
            columnEntries.push(entry);
            entriesByColumn.set(entry.columnId, columnEntries);
        });

        return statisticColumns.map((column) => ({
            column,
            entries: entriesByColumn.get(column.id) ?? [],
        }));
    }, [startDate, endDate]);

    return (
        <div className="flex h-full flex-col bg-background font-poppins">
            <PageHeader title="Statistics" icon={<BarChart3 size={22} />} />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {statistics?.map(({ column, entries }) =>
                        column.type === COLUMN_TYPES.CHECKBOX ? (
                            <CheckboxCard
                                key={column.id}
                                column={column}
                                entries={entries}
                                dates={dates}
                            />
                        ) : (
                            <NumberboxCard
                                key={column.id}
                                column={column}
                                entries={entries}
                                dates={dates}
                            />
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}
