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
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Vibrant Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        navy: {
          50: '#eff6ff', // Subtle Blue
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          900: '#09090b', // Deep rich black
          800: '#18181b',
          700: '#27272a',
          600: '#3f3f46',
        },
        studio: {
          50: '#F3EEFF', // Soft Lavender (Recommended)
          100: '#E9DCFC',
          200: '#D6BEFA',
          300: '#B892F7',
          400: '#9466F2',
          500: '#7047EB', // Primary Purple
          600: '#5F34E2',
          700: '#4D24CA',
          800: '#3C1A9D',
          900: '#1A0F35', // Deep Studio Midnight
          950: '#120924',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Hanken Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 12px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'orange-glow': '0 8px 25px -4px rgba(249, 115, 22, 0.3)',
        'blue-glow': '0 8px 25px -4px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
