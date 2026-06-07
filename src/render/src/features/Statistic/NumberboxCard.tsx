import React, { useState } from 'react';
import type { ColumnEntry } from 'app/types/columnEntries.types';
import type { NumberBoxColumn } from 'app/types/newColumn.types';
import { formatDateKey, getMonday } from 'app/utils/date';
import { StatisticPreviewCard } from 'features/Statistic/components/StatisticPreviewCard';
import { StatisticModalLayout } from 'features/Statistic/components/StatisticModalLayout';
import {
    StatisticValueWidget,
    StatisticVisualizationCard,
    StatisticWidgetGrid,
} from 'features/Statistic/components/StatisticWidgets';
import {
    NumberLineChart,
    type ChartPoint,
} from 'features/Statistic/components/NumberLineChart';

interface NumberboxCardProps {
    column: NumberBoxColumn;
    entries: ColumnEntry[];
    dates: Date[];
}

const getNumericPoints = (entries: ColumnEntry[]): ChartPoint[] =>
    entries
        .filter(
            (entry) =>
                entry.valueType === 'number' &&
                typeof entry.value === 'number' &&
                Number.isFinite(entry.value),
        )
        .map((entry) => ({
            dateKey: entry.dateKey,
            value: entry.value as number,
        }))
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

const getDailyChartPoints = (
    points: ChartPoint[],
    endDate: Date,
    daysCount: number,
): ChartPoint[] => {
    const valuesByDate = new Map(
        points.map((point) => [point.dateKey, point.value]),
    );

    return Array.from({ length: daysCount }, (_, index) => {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - (daysCount - index - 1));
        const dateKey = formatDateKey(date);

        return {
            dateKey,
            value: valuesByDate.get(dateKey) ?? null,
        };
    });
};

const getPeriodAverage = (
    points: ChartPoint[],
    startDate: Date,
    endDate: Date,
) => {
    const startKey = formatDateKey(startDate);
    const endKey = formatDateKey(endDate);
    const values = points
        .filter((point) => point.dateKey >= startKey && point.dateKey <= endKey)
        .map((point) => point.value);
    const average =
        values.length === 0
            ? 0
            : values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
        average,
        count: values.length,
    };
};

const formatValue = (value: number): string =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);

export function NumberboxCard({
    column,
    entries,
    dates,
}: NumberboxCardProps): React.ReactElement {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const today = dates[0];
    const todayKey = formatDateKey(today);
    const points = getNumericPoints(entries).filter(
        (point) => point.dateKey <= todayKey,
    );
    const cardStart = new Date(today);
    cardStart.setDate(today.getDate() - 47);
    const cardPoints = points.filter(
        (point) => point.dateKey >= formatDateKey(cardStart),
    );
    const monthlyPoints = getDailyChartPoints(points, today, 30);
    const currentValue = points.at(-1)?.value ?? 0;
    const highestValue =
        points.length === 0
            ? 0
            : Math.max(...points.map((point) => point.value));
    const weekStart = getMonday(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const allTimeStart =
        points.length > 0 ? new Date(`${points[0].dateKey}T00:00:00`) : today;
    const periodMetrics = [
        {
            label: 'This week',
            ...getPeriodAverage(points, weekStart, weekEnd),
        },
        {
            label: 'This month',
            ...getPeriodAverage(points, monthStart, monthEnd),
        },
        {
            label: 'All time',
            ...getPeriodAverage(points, allTimeStart, today),
        },
    ];

    return (
        <>
            <StatisticPreviewCard
                column={column}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="h-28 w-[20rem]">
                    <NumberLineChart points={cardPoints} height={112} compact />
                </div>
            </StatisticPreviewCard>

            <StatisticModalLayout
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                column={column}
                metrics={[
                    {
                        label: 'Current value',
                        value: formatValue(currentValue),
                    },
                    {
                        label: 'Highest value',
                        value: formatValue(highestValue),
                    },
                ]}
            >
                <StatisticWidgetGrid>
                    {periodMetrics.map((metric) => (
                        <StatisticValueWidget
                            key={metric.label}
                            label={`${metric.label} average`}
                            value={formatValue(metric.average)}
                            detail={`${metric.count} entries`}
                        />
                    ))}
                </StatisticWidgetGrid>

                <StatisticVisualizationCard>
                    <div className="h-72 w-full">
                        <NumberLineChart points={monthlyPoints} height={288} />
                    </div>
                </StatisticVisualizationCard>
            </StatisticModalLayout>
        </>
    );
}
