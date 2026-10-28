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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        obsidian: {
          950: '#070a12',
          900: '#0b0f19',
          850: '#101626',
          800: '#161e33',
          750: '#1c2640',
          700: '#243050',
          600: '#334155',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Kantumruy Pro', 'Inter', 'system-ui', 'sans-serif'],
        khmer: ['Kantumruy Pro', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
