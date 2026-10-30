/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a9f7',
          500: '#0e8ce8',
          600: '#026fc6',
          700: '#0358a0',
          800: '#074b83',
          900: '#0c3f6e',
          950: '#082849',
        },
        care: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#cfdccf',
          300: '#adc3ad',
          400: '#83a483',
          500: '#648864',
          600: '#4e6d4e',
          700: '#3f563f',
          800: '#344634',
          900: '#2b3a2b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'care-sm': ['1.125rem', { lineHeight: '1.75rem' }],
        'care-base': ['1.25rem', { lineHeight: '1.875rem' }],
        'care-lg': ['1.5rem', { lineHeight: '2rem' }],
        'care-xl': ['1.875rem', { lineHeight: '2.375rem' }],
        'care-2xl': ['2.25rem', { lineHeight: '2.75rem' }],
        'care-3xl': ['3rem', { lineHeight: '1.2' }],
      }
    },
  },
  plugins: [],
}
