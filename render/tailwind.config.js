/** @type {import('tailwindcss').Config} */
const paletteColors = [
  'accent1',
  'accent2',
  'accent3',
  'accent4',
  'accent5',
  'accent6',
  'accent7',
  'accent8',
  'accent9',
  'accent10',
];

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const paletteTokens = paletteColors.reduce((acc, color) => {
  const capitalized = capitalize(color);

  acc[`color${capitalized}Bg`] = `var(--color-${color}-bg)`;
  acc[`color${capitalized}Text`] = `var(--color-${color}-text)`;
  acc[`color${capitalized}Solid`] = `var(--color-${color}-solid)`;
  acc[`color${capitalized}Hover`] = `var(--color-${color}-hover)`;

  return acc;
}, {});

module.exports = {
  darkMode: ['selector', '[data-theme-mode="dark"]'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primaryColor: 'var(--primary)',
        primaryHover: 'var(--primary-hover)',
        danger: 'var(--danger)',
        dangerHover: 'var(--danger-hover)',

        background: 'var(--background)',
        border: 'var(--border)',
        text: 'var(--text)',
        textMuted: 'var(--text-muted)',
        textSubtle: 'var(--text-subtle)',
        textAccent: 'var(--text-accent)',

        backgrundHover: 'var(--backgrund-hover)',
        sidebarIconActive: 'var(--sidebar-icon-active)',
        sidebarIconInactive: 'var(--sidebar-icon-inactive)',

        surfaceMuted: 'var(--surface-muted)',
        surface: 'var(--surface)',

        secondary: 'var(--secondary)',
        secondaryHover: 'var(--secondary-hover)',
        secondaryText: 'var(--secondary-text)',

        ...paletteTokens,
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.drag': {
          '-webkit-app-region': 'drag',
        },
        '.no-drag': {
          '-webkit-app-region': 'no-drag',
        },
      });
    },
  ],
};
