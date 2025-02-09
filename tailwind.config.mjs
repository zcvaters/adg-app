/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        secondary: {
          50: '#FFF1F1',
          100: '#FFE1E1',
          200: '#FFC7C7',
          300: '#FFA3A3',
          400: '#FF7A7A',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: '#821225',
          800: '#610D1C',
          900: '#400812',
        },
        accent: {
          50: '#FFF8E6',
          100: '#FFEFC0',
          200: '#FFE099',
          300: '#FFD066',
          400: '#FFC033',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: '#996E00',
          800: '#664900',
          900: '#332500',
        },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        }
      },
    },
  },
  plugins: [],
} 