export interface ColorOption {
    name: string;
    bg: string;
    text: string;
}
export const getColorOptions = ({
    darkMode = false,
}: {
    darkMode?: boolean;
}): ColorOption[] => [
    {
        name: 'green',
        bg: darkMode ? 'bg-green-900' : 'bg-green-100',
        text: darkMode ? 'text-green-100' : 'text-green-800',
    },
    {
        name: 'blue',
        bg: darkMode ? 'bg-blue-900' : 'bg-blue-100',
        text: darkMode ? 'text-blue-100' : 'text-blue-800',
    },
    {
        name: 'purple',
        bg: darkMode ? 'bg-purple-900' : 'bg-purple-100',
        text: darkMode ? 'text-purple-100' : 'text-purple-800',
    },
    {
        name: 'orange',
        bg: darkMode ? 'bg-orange-900' : 'bg-orange-100',
        text: darkMode ? 'text-orange-100' : 'text-orange-800',
    },
    {
        name: 'yellow',
        bg: darkMode ? 'bg-yellow-900' : 'bg-yellow-100',
        text: darkMode ? 'text-yellow-100' : 'text-yellow-800',
    },
    {
        name: 'red',
        bg: darkMode ? 'bg-red-900' : 'bg-red-100',
        text: darkMode ? 'text-red-100' : 'text-red-800',
    },
    {
        name: 'pink',
        bg: darkMode ? 'bg-pink-900' : 'bg-pink-100',
        text: darkMode ? 'text-pink-100' : 'text-pink-800',
    },
    {
        name: 'teal',
        bg: darkMode ? 'bg-teal-900' : 'bg-teal-100',
        text: darkMode ? 'text-teal-100' : 'text-teal-800',
    },
    {
        name: 'gray',
        bg: darkMode ? 'bg-gray-900' : 'bg-gray-100',
        text: darkMode ? 'text-gray-100' : 'text-gray-800',
    },
    {
        name: 'lime',
        bg: darkMode ? 'bg-lime-900' : 'bg-lime-100',
        text: darkMode ? 'text-lime-100' : 'text-lime-800',
    },
];

export interface CheckBoxColorOption {
    bg: string;
    hex: string;
    hover: string;
}

export type CheckBoxColorOptions = {
    [key: string]: CheckBoxColorOption;
};

export const getCheckBoxColorOptions = ({
    darkMode = false,
}: {
    darkMode?: boolean;
}): CheckBoxColorOptions => ({
    green: {
        bg: 'bg-green-500',
        hex: '#10b981',
        hover: darkMode ? 'hover:bg-green-600' : 'hover:bg-green-400',
    },
    blue: {
        bg: 'bg-blue-500',
        hex: '#3b82f6',
        hover: darkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-400',
    },
    purple: {
        bg: 'bg-purple-500',
        hex: '#8b5cf6',
        hover: darkMode ? 'hover:bg-purple-600' : 'hover:bg-purple-400',
    },
    orange: {
        bg: 'bg-orange-500',
        hex: '#f97316',
        hover: darkMode ? 'hover:bg-orange-600' : 'hover:bg-orange-400',
    },
    yellow: {
        bg: 'bg-yellow-500',
        hex: '#eab308',
        hover: darkMode ? 'hover:bg-yellow-600' : 'hover:bg-yellow-400',
    },
    red: {
        bg: 'bg-red-500',
        hex: '#ef4444',
        hover: darkMode ? 'hover:bg-red-600' : 'hover:bg-red-400',
    },
    pink: {
        bg: 'bg-pink-500',
        hex: '#ec4899',
        hover: darkMode ? 'hover:bg-pink-600' : 'hover:bg-pink-400',
    },
    teal: {
        bg: 'bg-teal-500',
        hex: '#14b8a6',
        hover: darkMode ? 'hover:bg-teal-600' : 'hover:bg-teal-400',
    },
    gray: {
        bg: 'bg-gray-500',
        hex: '#6b7280',
        hover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-400',
    },
    lime: {
        bg: 'bg-lime-500',
        hex: '#84cc16',
        hover: darkMode ? 'hover:bg-lime-600' : 'hover:bg-lime-400',
    },
});
