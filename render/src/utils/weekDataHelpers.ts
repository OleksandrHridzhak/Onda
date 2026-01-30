import {
    WeeklyValues,
    createEmptyWeeklyValues,
} from '../types/newColumn.types';

/**
 * Get the current week ID (Monday's date in YYYY-MM-DD format)
 */
function getCurrentWeekId(): string {
    function getMonday(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    const monday = getMonday(new Date());
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const day = String(monday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get week data for a specific week from column
 * Returns data from 'days' if it's the current week, otherwise from weeksHistory
 */
export function getWeekData<T>(
    columnData: {
        days: WeeklyValues<T>;
        weeksHistory?: Record<string, WeeklyValues<T>>;
    },
    weekId: string,
    defaultValue: T,
): WeeklyValues<T> {
    const currentWeekId = getCurrentWeekId();

    // If requesting current week and no history exists, return current days
    if (weekId === currentWeekId) {
        return columnData.days;
    }

    // Try to get from history
    if (columnData.weeksHistory && columnData.weeksHistory[weekId]) {
        return columnData.weeksHistory[weekId];
    }

    // Return empty values if no data exists for this week
    return createEmptyWeeklyValues(defaultValue);
}

/**
 * Save week data for a specific week
 * Updates 'days' if it's the current week, otherwise updates weeksHistory
 */
export function saveWeekData<T>(
    weekId: string,
    weekData: WeeklyValues<T>,
): Record<string, any> {
    const currentWeekId = getCurrentWeekId();

    if (weekId === currentWeekId) {
        // Save to current days
        return {
            'uniqueProps.days': weekData,
        };
    } else {
        // Save to history
        return {
            [`uniqueProps.weeksHistory.${weekId}`]: weekData,
        };
    }
}

/**
 * Update a single day's value in the week data
 */
export function updateWeekDayValue<T>(
    columnData: {
        days: WeeklyValues<T>;
        weeksHistory?: Record<string, WeeklyValues<T>>;
    },
    weekId: string,
    day: keyof WeeklyValues<T>,
    value: T,
    defaultValue: T,
): Record<string, any> {
    const weekData = getWeekData(columnData, weekId, defaultValue);
    const updatedWeekData = { ...weekData, [day]: value };
    return saveWeekData(weekId, updatedWeekData);
}
