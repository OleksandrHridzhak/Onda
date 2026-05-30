/** @type {import('tailwindcss').Config} */
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
        
        // Sidebar
        backgrundHover: 'var(--backgrund-hover)',
        sidebarIconActive: 'var(--sidebar-icon-active)',
        sidebarIconInactive: 'var(--sidebar-icon-inactive)',
        
        // Таблиці
        surfaceMuted: 'var(--surface-muted)',
        surface: 'var(--surface)',
        
        // Налаштування
        
        // Кнопки
        secondary: 'var(--secondary)',
        secondaryHover: 'var(--secondary-hover)',
        secondaryText: 'var(--secondary-text)',
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
