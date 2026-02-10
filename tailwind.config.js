/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        trust: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#3f4b96',
          700: '#26346d',
          900: '#142045'
        },
        fairness: {
          100: '#dff7f1',
          500: '#10957d',
          700: '#0d705f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'Manrope', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        card: '0 14px 34px rgba(20, 32, 69, 0.12)'
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
