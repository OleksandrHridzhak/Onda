import React, { useMemo } from 'react';
import { useDbQuery } from 'shared/api/db';
import { BarChart3 } from 'lucide-react';
import { COLUMN_TYPES } from 'features/columns/types/definitions';
import type { ColumnEntry } from 'features/table/types/entryTypes';
import type {
    CheckboxColumn,
    NumberBoxColumn,
} from 'features/columns/types/types';
import { formatDateKey } from 'shared/lib/date';
import { getEntriesForDateRange } from 'features/table/api/columnEntries';
import { getAllColumns } from 'features/columns/api/columns';
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

export function StatisticsDashboard(): React.ReactElement {
    const dates = useMemo(() => getRecentDays(), []);
    const startDate = '0000-01-01';
    const endDate = formatDateKey(dates[0]);

    const statistics = useDbQuery<ColumnStatistics[]>(
        async () => {
            const [columnsResult, entriesResult] = await Promise.all([
                getAllColumns(),
                getEntriesForDateRange(startDate, endDate),
            ]);

            if (
                !columnsResult.success ||
                !entriesResult.success ||
                !columnsResult.data ||
                !entriesResult.data
            ) {
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
        },
        ['columns', 'entries'],
        `${startDate}_${endDate}`,
    );

    return (
        <div className="flex h-full flex-col bg-background font-poppins">
            <PageHeader title="Statistics" icon={<BarChart3 size={22} />} />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {statistics?.map(({ column, entries }) => {
                        if (column.type === COLUMN_TYPES.CHECKBOX) {
                            return (
                                <CheckboxCard
                                    key={column.id}
                                    column={column as CheckboxColumn}
                                    entries={entries}
                                    dates={dates}
                                />
                            );
                        }
                        return (
                            <NumberboxCard
                                key={column.id}
                                column={column as NumberBoxColumn}
                                entries={entries}
                                dates={dates}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default StatisticsDashboard;
