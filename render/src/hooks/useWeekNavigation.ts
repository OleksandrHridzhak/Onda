import { useState, useEffect } from 'react';

/**
 * Custom hook for week navigation
 * Manages current week start date and provides navigation functions
 */
export function useWeekNavigation() {
    /**
     * Get the Monday of the week containing the given date
     */
    function getMonday(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0); // Reset time to start of day
        return d;
    }

    /**
     * Format a date as YYYY-MM-DD for use as a week identifier
     */
    function formatWeekId(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Get ISO week number for a date
     */
    function getWeekNumber(date: Date): number {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
        const week1 = new Date(d.getFullYear(), 0, 4);
        return Math.round(((d.getTime() - week1.getTime()) / 86400000 + 1) / 7);
    }

    /**
     * Get array of 7 dates starting from the given date
     */
    function getWeekDays(startDate: Date): Date[] {
        const days: Date[] = [];
        const date = new Date(startDate);
        for (let i = 0; i < 7; i++) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    // Initialize with current week's Monday
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
        getMonday(new Date())
    );

    const [weekDays, setWeekDays] = useState<Date[]>(
        getWeekDays(getMonday(new Date()))
    );

    // Update week days whenever current week start changes
    useEffect(() => {
        setWeekDays(getWeekDays(currentWeekStart));
    }, [currentWeekStart]);

    /**
     * Navigate to previous week
     */
    const goToPreviousWeek = (): void => {
        const prevMonday = new Date(currentWeekStart);
        prevMonday.setDate(prevMonday.getDate() - 7);
        setCurrentWeekStart(prevMonday);
    };

    /**
     * Navigate to next week
     */
    const goToNextWeek = (): void => {
        const nextMonday = new Date(currentWeekStart);
        nextMonday.setDate(nextMonday.getDate() + 7);
        setCurrentWeekStart(nextMonday);
    };

    /**
     * Navigate to current week
     */
    const goToCurrentWeek = (): void => {
        const today = new Date();
        setCurrentWeekStart(getMonday(today));
    };

    /**
     * Check if currently viewing the current week
     */
    const isCurrentWeek = (): boolean => {
        const today = getMonday(new Date());
        return formatWeekId(currentWeekStart) === formatWeekId(today);
    };

    /**
     * Format week range for display (e.g., "Jan 1 - 7, 2024")
     */
    const formatWeekRange = (): string => {
        const start = weekDays[0];
        const end = weekDays[weekDays.length - 1];

        if (
            start.getMonth() === end.getMonth() &&
            start.getFullYear() === end.getFullYear()
        ) {
            return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`;
        }

        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return {
        currentWeekStart,
        weekDays,
        weekId: formatWeekId(currentWeekStart),
        weekNumber: getWeekNumber(currentWeekStart),
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
        isCurrentWeek: isCurrentWeek(),
        formatWeekRange: formatWeekRange(),
    };
}
