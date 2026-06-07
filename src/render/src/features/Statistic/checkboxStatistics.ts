import type { CheckboxColumn } from 'app/types/newColumn.types';
import { formatDateKey, getMonday } from 'app/utils/date';

export interface CompletionMetric {
    label: string;
    checked: number;
    total: number;
    percentage: number;
}

const getCompletionMetric = (
    checkedDateKeys: Set<string>,
    startDate: Date,
    endDate: Date,
) => {
    let checked = 0;
    let total = 0;
    const cursor = new Date(startDate);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= endDate) {
        total += 1;
        if (checkedDateKeys.has(formatDateKey(cursor))) checked += 1;
        cursor.setDate(cursor.getDate() + 1);
    }

    return {
        checked,
        total,
        percentage: total === 0 ? 0 : Math.round((checked / total) * 100),
    };
};

export const getCheckboxStreaks = (
    checkedDateKeys: Set<string>,
    today: Date,
) => {
    const todayKey = formatDateKey(today);
    const sortedDates = Array.from(checkedDateKeys)
        .filter((dateKey) => dateKey <= todayKey)
        .sort();
    let longest = 0;
    let running = 0;
    let previousDate: Date | null = null;

    sortedDates.forEach((dateKey) => {
        const date = new Date(`${dateKey}T00:00:00`);
        const isConsecutive =
            previousDate !== null &&
            Math.round((date.getTime() - previousDate.getTime()) / 86400000) ===
                1;
        running = isConsecutive ? running + 1 : 1;
        longest = Math.max(longest, running);
        previousDate = date;
    });

    let current = 0;
    const cursor = new Date(today);
    while (checkedDateKeys.has(formatDateKey(cursor))) {
        current += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return { current, longest, sortedDates };
};

export const getCompletionMetrics = (
    column: CheckboxColumn,
    checkedDateKeys: Set<string>,
    today: Date,
    sortedDates: string[],
): CompletionMetric[] => {
    const weekStart = getMonday(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lifecycleStart = column.lifecycle.createdAt
        ? getMonday(new Date(column.lifecycle.createdAt))
        : sortedDates.length > 0
          ? new Date(`${sortedDates[0]}T00:00:00`)
          : today;
    const lifecycleEnd = column.lifecycle.archivedAt
        ? new Date(column.lifecycle.archivedAt)
        : today;
    lifecycleEnd.setHours(0, 0, 0, 0);

    return [
        {
            label: 'This week',
            ...getCompletionMetric(checkedDateKeys, weekStart, weekEnd),
        },
        {
            label: 'This month',
            ...getCompletionMetric(checkedDateKeys, monthStart, monthEnd),
        },
        {
            label: 'All time',
            ...getCompletionMetric(
                checkedDateKeys,
                lifecycleStart,
                lifecycleEnd < today ? lifecycleEnd : today,
            ),
        },
    ];
};

export const getCalendarDates = (
    today: Date,
    daysCount: number,
): Array<Date | null> => {
    const rangeStart = new Date(today);
    rangeStart.setDate(today.getDate() - (daysCount - 1));
    const calendarStart = getMonday(rangeStart);
    const calendarEnd = new Date(today);
    calendarEnd.setDate(today.getDate() + (7 - ((today.getDay() + 6) % 7) - 1));
    const calendarDaysCount =
        Math.round(
            (calendarEnd.getTime() - calendarStart.getTime()) / 86400000,
        ) + 1;

    return Array.from({ length: calendarDaysCount }, (_, index) => {
        const date = new Date(calendarStart);
        date.setDate(calendarStart.getDate() + index);
        return date >= rangeStart && date <= today ? date : null;
    });
};
