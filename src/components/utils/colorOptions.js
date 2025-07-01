//Accent colors for App
export const getColorOptions = ({darkMode = false}) => [
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
];

export const getCheckBoxColorOptions = ({darkMode=false}) => ({
    green: {
        bg: darkMode ? 'bg-green-500' : 'bg-green-500',
        border: 'border-transparent',
        hover: darkMode ? 'hover:bg-green-600' : 'hover:bg-green-400'
    },
    blue: {
        bg: darkMode ? 'bg-blue-700' : 'bg-blue-500',
        border: 'border-transparent',
        hover: darkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-400'
    },
    purple: {
        bg: darkMode ? 'bg-purple-700' : 'bg-purple-500',
        border: 'border-transparent',
        hover: darkMode ? 'hover:bg-purple-600' : 'hover:bg-purple-400'
    },
    orange: {
        bg: darkMode ? 'bg-orange-700' : 'bg-orange-500',
        border: 'border-transparent',
        hover: darkMode ? 'hover:bg-orange-600' : 'hover:bg-orange-400'
    }
});
