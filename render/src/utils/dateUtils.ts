/**
 * Date utility functions for mobile view
 */

/**
 * Get the Monday of the week for a given date
 */
export const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Get all days in a week starting from a given date
 */
export const getWeekDays = (startDate: Date): Date[] => {
  const days: Date[] = [];
  const date = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

/**
 * Format a date for display in mobile view header
 */
export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};
