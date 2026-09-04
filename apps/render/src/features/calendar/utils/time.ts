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

export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Validates HH:mm time format.
 */
export const validateTime = (time: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

/**
 * Shifts a "HH:mm" time by a given number of minutes, wrapping around 24 hours.
 */
export const shiftTime = (time: string, deltaMinutes: number): string => {
  const total = (timeToMinutes(time) + deltaMinutes + 24 * 60) % (24 * 60);
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};
