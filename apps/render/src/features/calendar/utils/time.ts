/**
 * Utility functions for time and calendar duration calculations.
 */

/**
 * Converts a "HH:mm" time string to minutes from midnight.
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Calculates event duration in minutes, handling overnight events (crossing midnight).
 */
export const calculateEventDurationMinutes = (
  startTime: string,
  endTime: string,
): number => {
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  if (end <= start) {
    end += 24 * 60;
  }
  return end - start;
};

/**
 * Formats an hour number into a two-digit "HH:00" string.
 */
export const formatHour = (hour: number): string =>
  `${hour.toString().padStart(2, "0")}:00`;
