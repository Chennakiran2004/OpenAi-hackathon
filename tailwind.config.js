/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1F7A4D',      // Primary Brand Green
          accent: '#2BB673',       // Accent Green
          highlight: '#22C55E',    // Highlight (Carbon Badge)
          warning: '#F59E0B',      // Warning/Time Accent
          dark: '#0F172A',         // Dark Background
          light: '#F5F7FA',        // Light Background
        },
        primary: {
          50: '#f0fdf7',
          100: '#dcfcec',
          200: '#bbf7d9',
          300: '#86efbd',
          400: '#4ade99',
          500: '#2BB673',
          600: '#1F7A4D',
          700: '#166239',
          800: '#144e2e',
          900: '#124027',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'Manrope', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        card: '0 14px 34px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
