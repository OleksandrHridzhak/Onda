import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../shared/PageHeader';
import { Heading } from '../shared/Heading';
import { getAllColumns } from '../../db/helpers/columns';
import { db } from '../../db';
import type { ColumnEntry } from '../../types/columnEntries.types';
import {
    ColumnStatsCard,
    COLUMN_TYPE_LABELS,
    getColumnSummary,
    getLatestEntryDate,
    getPrimaryMetric,
    getTrackedDaysCount,
} from './statisticsShared';

export default function StatisticsPage(): React.ReactElement {
    const navigate = useNavigate();

    const statsData = useLiveQuery<ColumnStatsCard[] | null>(async () => {
        const [columnsResult, entriesResult] = await Promise.all([
            getAllColumns(),
            db.columnEntries.toArray(),
        ]);

        if (!columnsResult.success) {
            return null;
        }

        const entriesByColumn = new Map<string, ColumnEntry[]>();

        entriesResult.forEach((entry) => {
            const columnEntries = entriesByColumn.get(entry.columnId) ?? [];
            columnEntries.push(entry);
            entriesByColumn.set(entry.columnId, columnEntries);
        });

        return columnsResult.data.map((column) => ({
            column,
            entries: entriesByColumn.get(column.id) ?? [],
        }));
    }, []);

    return (
        <div className="flex h-full flex-col bg-background font-poppins">
            <PageHeader title="Statistics" icon={<BarChart3 size={22} />} />

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {!statsData ? (
                    <div className="rounded-lg border border-border bg-surface p-6 text-sm text-textMuted">
                        Loading statistics...
                    </div>
                ) : statsData.length === 0 ? (
                    <div className="rounded-lg border border-border bg-surface p-6 text-sm text-textMuted">
                        No columns yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {statsData.map(({ column, entries }) => {
                            const primaryMetric = getPrimaryMetric(
                                column,
                                entries,
                            );

                            return (
                                <button
                                    key={column.id}
                                    type="button"
                                    onClick={() =>
                                        navigate(`/statistics/${column.id}`)
                                    }
                                    className="rounded-lg border border-border bg-surface p-4 text-left transition-all duration-200 hover:border-primaryColor/30 hover:bg-surfaceMuted hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <Heading as="h2" variant="base">
                                                {column.name}
                                            </Heading>
                                            <p className="mt-1 text-sm text-textMuted">
                                                {
                                                    COLUMN_TYPE_LABELS[
                                                        column.type
                                                    ]
                                                }
                                            </p>
                                        </div>
                                        <span className="rounded-md bg-surfaceMuted px-2 py-1 text-xs text-textMuted">
                                            {column.emojiIconName || 'Column'}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm text-textMuted">
                                        {getColumnSummary(column)}
                                    </p>

                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        <div className="rounded-lg bg-background p-3">
                                            <p className="text-xs text-textSubtle">
                                                Tracked Days
                                            </p>
                                            <p className="mt-1 text-lg font-semibold text-text">
                                                {getTrackedDaysCount(
                                                    column,
                                                    entries,
                                                )}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-background p-3">
                                            <p className="text-xs text-textSubtle">
                                                {primaryMetric.label}
                                            </p>
                                            <p className="mt-1 text-lg font-semibold text-text">
                                                {primaryMetric.value}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-background p-3">
                                            <p className="text-xs text-textSubtle">
                                                Latest Entry
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-text">
                                                {getLatestEntryDate(entries)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
