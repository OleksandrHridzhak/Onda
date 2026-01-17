/**
 * Static mapping for checkbox theme classes.
 * Uses Tailwind's dark: prefix to handle theme switching at the
 * CSS level (dark: is managed via a data attribute in tag <html>).
 */

export const CHECKBOX_COLORS = {
    green: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600 dark:hover:bg-green-400',
    },
    blue: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600 dark:hover:bg-blue-400',
    },
    purple: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600 dark:hover:bg-purple-400',
    },
    orange: {
        bg: 'bg-orange-500',
        hover: 'hover:bg-orange-600 dark:hover:bg-orange-400',
    },
    yellow: {
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600 dark:hover:bg-yellow-400',
    },
    red: { bg: 'bg-red-500', hover: 'hover:bg-red-600 dark:hover:bg-red-400' },
    pink: {
        bg: 'bg-pink-500',
        hover: 'hover:bg-pink-600 dark:hover:bg-pink-400',
    },
    teal: {
        bg: 'bg-teal-500',
        hover: 'hover:bg-teal-600 dark:hover:bg-teal-400',
    },
    gray: {
        bg: 'bg-gray-500',
        hover: 'hover:bg-gray-600 dark:hover:bg-gray-400',
    },
    lime: {
        bg: 'bg-lime-500',
        hover: 'hover:bg-lime-600 dark:hover:bg-lime-400',
    },
} as const;
