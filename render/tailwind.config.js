/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'ui-primary': 'var(--ui-primary)',
        'ui-background': 'var(--ui-background)',
        'ui-border': 'var(--ui-border)',
        'ui-hover': 'var(--ui-hover)',
        
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-accent': 'var(--text-accent)',
        'text-on-primary': 'var(--text-on-primary)',

        'sidebar-background-hover': 'var(--sidebar-background-hover)',
        'sidebar-text-active': 'var(--sidebar-text-active)',
        'sidebar-text-inactive': 'var(--sidebar-text-inactive)',
        'sidebar-icon-active': 'var(--sidebar-icon-active)',
        'sidebar-icon-inactive': 'var(--sidebar-icon-inactive)',
        
        'table-header-background': 'var(--table-header-background)',
        'table-header-text': 'var(--table-header-text)',
        'table-body-background': 'var(--table-body-background)',
        'table-summary-text': 'var(--table-summary-text)',
        
        'settings-selector-background': 'var(--settings-selector-background)',
        
        'button-primary-background': 'var(--button-primary-background)',
        'button-primary-background-hover': 'var(--button-primary-background-hover)',
        'button-danger-background': 'var(--button-danger-background)',
        'button-danger-background-hover': 'var(--button-danger-background-hover)',
        'button-secondary-background': 'var(--button-secondary-background)',
        'button-secondary-background-hover': 'var(--button-secondary-background-hover)',
        'button-secondary-text': 'var(--button-secondary-text)',
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
