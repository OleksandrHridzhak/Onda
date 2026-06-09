import React, { useState } from 'react';
import type { CheckboxColumn } from 'entities/Column';
import type { ColumnEntry } from 'entities/ColumnEntry';
import { COLOR_STYLES } from 'shared/lib/color';
import { formatDateKey } from 'shared/lib/date';
import { StatisticPreviewCard } from './components/StatisticPreviewCard';
import { StatisticModalLayout } from './components/StatisticModalLayout';
import {
    StatisticProgressWidget,
    StatisticVisualizationCard,
    StatisticWidgetGrid,
} from './components/StatisticWidgets';
import {
    getCalendarDates,
    getCheckboxStreaks,
    getCompletionMetrics,
} from '../lib/checkboxStatistics';

interface CheckboxCardProps {
    column: CheckboxColumn;
    entries: ColumnEntry[];
    dates: Date[];
}

const dateLabelFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
});

const isCheckedValue = (value: unknown): boolean =>
    value === true || value === 'true' || value === 1;

const CALENDAR_DAYS = 357;

export function CheckboxCard({
    column,
    entries,
    dates,
}: CheckboxCardProps): React.ReactElement {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const checkedDateKeys = new Set(
        entries
            .filter((entry) => isCheckedValue(entry.value))
            .map((entry) => entry.dateKey),
    );
    const color = COLOR_STYLES[column.uniqueProps.checkboxColor];
    const visibleDates = dates.slice(0, 48).reverse();
    const today = dates[0];
    const {
        current: currentStreak,
        longest: longestStreak,
        sortedDates,
    } = getCheckboxStreaks(checkedDateKeys, today);
    const completionMetrics = getCompletionMetrics(
        column,
        checkedDateKeys,
        today,
        sortedDates,
    );
    const calendarDates = getCalendarDates(today, CALENDAR_DAYS);

    return (
        <>
            <StatisticPreviewCard
                column={column}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="grid grid-flow-col grid-rows-4 grid-cols-12 justify-start gap-2 overflow-hidden">
                    {visibleDates.map((date) => {
                        const dateKey = formatDateKey(date);
                        const isChecked = checkedDateKeys.has(dateKey);
                        const stateLabel = isChecked
                            ? 'checked'
                            : 'not checked';

                        return (
                            <span
                                key={dateKey}
                                role="img"
                                aria-label={`${dateLabelFormatter.format(date)}: ${stateLabel}`}
                                className={`h-6 w-5 rounded border transition-colors ${
                                    isChecked
                                        ? `${color.solid} border-transparent`
                                        : 'border-border bg-surfaceMuted'
                                }`}
                            />
                        );
                    })}
                </div>
            </StatisticPreviewCard>

            <StatisticModalLayout
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                column={column}
                metrics={[
                    {
                        label: 'Current streak',
                        value: `${currentStreak} days`,
                    },
                    {
                        label: 'Longest streak',
                        value: `${longestStreak} days`,
                    },
                ]}
            >
                <StatisticWidgetGrid>
                    {completionMetrics.map((metric) => (
                        <StatisticProgressWidget
                            key={metric.label}
                            label={metric.label}
                            percentage={metric.percentage}
                            detail={`${metric.checked}/${metric.total} completed`}
                        />
                    ))}
                </StatisticWidgetGrid>

                <StatisticVisualizationCard>
                    <div className="custom-scroll w-full overflow-x-auto">
                        <div className="mx-auto grid w-max grid-flow-col grid-rows-[repeat(7,0.75rem)] auto-cols-[0.75rem] gap-1">
                            {calendarDates.map((date, index) => {
                                if (!date) {
                                    return (
                                        <span
                                            key={`future-${index}`}
                                            aria-hidden="true"
                                            className="h-3 w-3"
                                        />
                                    );
                                }

                                const dateKey = formatDateKey(date);
                                const isChecked = checkedDateKeys.has(dateKey);
                                const stateLabel = isChecked
                                    ? 'checked'
                                    : 'not checked';

                                return (
                                    <span
                                        key={dateKey}
                                        role="img"
                                        aria-label={`${dateLabelFormatter.format(date)}: ${stateLabel}`}
                                        title={dateLabelFormatter.format(date)}
                                        className={`h-3 w-3 rounded-[3px] border ${
                                            isChecked
                                                ? `${color.solid} border-transparent`
                                                : 'border-border bg-surfaceMuted'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </StatisticVisualizationCard>
            </StatisticModalLayout>
        </>
    );
}
