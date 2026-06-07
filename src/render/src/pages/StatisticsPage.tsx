import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3 } from 'lucide-react';
import { COLUMN_TYPES } from 'app/constants/columnTypes';
import type { ColumnEntry } from 'app/types/columnEntries.types';
import type { CheckboxColumn } from 'app/types/newColumn.types';
import { formatDateKey } from 'app/utils/date';
import { getEntriesForDateRange } from 'db/helpers/columnEntries';
import { getAllColumns } from 'db/helpers/columns';
import { CheckboxCard } from 'features/Statistic/CheckboxCard';
import { PageHeader } from 'shared/layout/PageHeader';

interface CheckboxStatistics {
    column: CheckboxColumn;
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
    const startDate = formatDateKey(dates[dates.length - 1]);
    const endDate = formatDateKey(dates[0]);

    const statistics = useLiveQuery<CheckboxStatistics[]>(async () => {
        const [columnsResult, entriesResult] = await Promise.all([
            getAllColumns(),
            getEntriesForDateRange(startDate, endDate),
        ]);

        if (!columnsResult.success || !entriesResult.success) {
            return [];
        }

        const checkboxColumns = columnsResult.data.filter(
            (column): column is CheckboxColumn =>
                column.type === COLUMN_TYPES.CHECKBOX,
        );
        const entriesByColumn = new Map<string, ColumnEntry[]>();

        entriesResult.data.forEach((entry) => {
            const columnEntries = entriesByColumn.get(entry.columnId) ?? [];
            columnEntries.push(entry);
            entriesByColumn.set(entry.columnId, columnEntries);
        });

        return checkboxColumns.map((column) => ({
            column,
            entries: entriesByColumn.get(column.id) ?? [],
        }));
    }, [startDate, endDate]);

    return (
        <div className="flex h-full flex-col bg-background font-poppins">
            <PageHeader title="Statistics" icon={<BarChart3 size={22} />} />

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {statistics?.map(({ column, entries }) => (
                        <CheckboxCard
                            key={column.id}
                            column={column}
                            entries={entries}
                            dates={dates}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
