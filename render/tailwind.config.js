/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        surface: 'var(--surface)',
        border: 'var(--border)',
        text: 'var(--text)',
        textAccent: 'var(--text-accent)',
        iconActive: 'var(--icon-active)',
        iconInactive: 'var(--icon-inactive)',
        linkActiveBg: 'var(--link-active-bg)',
        linkInactiveBg: 'var(--link-inactive-bg)',
        toggleIcon: 'var(--toggle-icon)',
        toggleHoverBg: 'var(--toggle-hover-bg)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
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
