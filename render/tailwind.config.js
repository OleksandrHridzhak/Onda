/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primaryColor: 'var(--primary-color)',

        background: 'var(--background)',
        border: 'var(--border)',
        text: 'var(--text)',
        textAccent: 'var(--text-accent)',
        textTableValues: 'var(--text-table-values)',
        textTableRealValues: 'var(--text-table-real-values)',

        // Sidebar
        linkInactiveText: 'var(--link-inactive-text)',
        linkInactiveHoverBg: 'var(--link-inactive-hover-bg)',
        iconActive: 'var(--icon-active)',
        iconInactive: 'var(--icon-inactive)',
        toggleIcon: 'var(--toggle-icon)',
        hoverBg: 'var(--hover-bg)',
        sidebarToggleHoverBg: 'var(--sidebar-toggle-hover-bg)',

        // Таблиці
        tableHeader: 'var(--table-header)',
        tableHeaderText: 'var(--table-header-text)',
        tableBodyBg: 'var(--table-body-bg)',
        tableSummaryText: 'var(--table-summary-text)',

        // Налаштування
        settingsSectionSelectorBg: 'var(--settings-section-selector-bg)',

        // Кнопки
        bubbleBtnStandard: 'var(--bubble-btn-standard)',
        bubbleBtnStandardHover: 'var(--bubble-btn-standard-hover)',
        bubbleBtnDelete: 'var(--bubble-btn-delete)',
        bubbleBtnDeleteHover: 'var(--bubble-btn-delete-hover)',
        bubbleBtnClear: 'var(--bubble-btn-clear)',
        bubbleBtnClearHover: 'var(--bubble-btn-clear-hover)',
        bubbleBtnClearText: 'var(--bubble-btn-clear-text)',
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
