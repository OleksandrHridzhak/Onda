import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from 'shared/PageHeader';
import { Heading } from 'shared/Heading';
import { getColumnById } from 'db/helpers/columns';
import { db } from 'db';
import type { ColumnEntry } from 'app/types/columnEntries.types';
import {
    COLUMN_TYPE_LABELS,
    formatEntryDate,
    getColumnSummary,
    getEntryDetailText,
    getLatestEntryDate,
    getPrimaryMetric,
    getTrackedDaysCount,
    renderEntryPreview,
    sortEntriesByDateDesc,
} from 'pages/statisticsShared';

interface StatisticsDetailsData {
    column: Awaited<ReturnType<typeof getColumnById>>['data'];
    entries: ColumnEntry[];
}

function StatPanel({
    label,
    value,
}: {
    label: string;
    value: string;
}): React.ReactElement {
    return (
        <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-textMuted">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-text">{value}</p>
        </div>
    );
}

export default function StatisticsColumnDetailsPage(): React.ReactElement {
    const navigate = useNavigate();
    const { columnId } = useParams();

    const detailsData = useLiveQuery<StatisticsDetailsData | null>(async () => {
        if (!columnId) {
            return null;
        }

        const [columnResult, entriesResult] = await Promise.all([
            getColumnById(columnId),
            db.columnEntries.where('columnId').equals(columnId).toArray(),
        ]);

        if (!columnResult.success) {
            return null;
        }

        return {
            column: columnResult.data,
            entries: sortEntriesByDateDesc(entriesResult),
        };
    }, [columnId]);

    if (!detailsData) {
        return (
            <div className="flex h-full flex-col bg-background font-poppins">
                <PageHeader
                    title="Column Statistics"
                    icon={<BarChart3 size={22} />}
                >
                    <button
                        type="button"
                        onClick={() => navigate('/statistics')}
                        className="rounded-lg px-3 py-2 text-sm text-textMuted transition-colors hover:bg-backgrundHover hover:text-text"
                    >
                        Back
                    </button>
                </PageHeader>

                <div className="p-6">
                    <div className="rounded-lg border border-border bg-surface p-6 text-sm text-textMuted">
                        Loading column details...
                    </div>
                </div>
            </div>
        );
    }

    const { column, entries } = detailsData;
    const trackedDays = getTrackedDaysCount(column, entries);
    const primaryMetric = getPrimaryMetric(column, entries);

    return (
        <div className="flex h-full flex-col bg-background font-poppins">
            <PageHeader title={column.name} icon={<BarChart3 size={22} />}>
                <button
                    type="button"
                    onClick={() => navigate('/statistics')}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-textMuted transition-colors hover:bg-backgrundHover hover:text-text"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </PageHeader>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-6">
                    <section className="rounded-lg border border-border bg-surface p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                                <Heading as="h2" variant="lg">
                                    {column.name}
                                </Heading>
                                <p className="mt-1 text-sm text-textMuted">
                                    {COLUMN_TYPE_LABELS[column.type]}
                                </p>
                                <p className="mt-3 max-w-3xl text-sm text-textMuted">
                                    {getColumnSummary(column)}
                                </p>
                            </div>
                            <div className="rounded-lg bg-surfaceMuted px-3 py-2 text-sm text-textMuted">
                                {column.emojiIconName || 'Column'}
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <StatPanel
                            label="Type"
                            value={COLUMN_TYPE_LABELS[column.type]}
                        />
                        <StatPanel
                            label="Tracked Days"
                            value={String(trackedDays)}
                        />
                        <StatPanel
                            label={primaryMetric.label}
                            value={primaryMetric.value}
                        />
                        <StatPanel
                            label="Latest Entry"
                            value={getLatestEntryDate(entries)}
                        />
                    </section>

                    <section className="rounded-lg border border-border bg-surface p-5">
                        <Heading as="h3" variant="base">
                            All-Time History
                        </Heading>
                        {entries.length === 0 ? (
                            <div className="mt-4 rounded-lg border border-border bg-background p-4 text-sm text-textMuted">
                                No day-based history saved for this column yet.
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {entries.map((entry) => {
                                    const entryDate = formatEntryDate(
                                        entry.dateKey,
                                    );

                                    return (
                                        <article
                                            key={entry.id}
                                            className="rounded-lg border border-border bg-background p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium text-text">
                                                        {entryDate.label}
                                                    </p>
                                                    <p className="text-xs text-textSubtle">
                                                        {entryDate.shortDate}
                                                    </p>
                                                </div>
                                                {renderEntryPreview(
                                                    column,
                                                    entry,
                                                )}
                                            </div>
                                            <p className="mt-4 text-sm leading-6 text-textMuted">
                                                {getEntryDetailText(
                                                    column,
                                                    entry,
                                                )}
                                            </p>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-lg border border-border bg-surface p-5">
                            <Heading as="h3" variant="base">
                                Column Metadata
                            </Heading>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <dt className="text-textMuted">Width</dt>
                                    <dd className="text-text">
                                        {column.width}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <dt className="text-textMuted">
                                        Name Visible
                                    </dt>
                                    <dd className="text-text">
                                        {column.isNameVisible ? 'Yes' : 'No'}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <dt className="text-textMuted">
                                        Description
                                    </dt>
                                    <dd className="max-w-[70%] text-right text-text">
                                        {column.description || 'No description'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-lg border border-border bg-surface p-5">
                            <Heading as="h3" variant="base">
                                Notes
                            </Heading>
                            <p className="mt-4 text-sm leading-6 text-textMuted">
                                This page reads the full stored history for each
                                column. Columns like Todo List and Task Table
                                keep most of their state as a running structure,
                                so their statistics here are based more on
                                current structure than on historical day
                                entries.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
