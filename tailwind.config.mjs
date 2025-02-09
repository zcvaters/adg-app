/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EEF7',
          100: '#CCDDEF',
          200: '#99BBDF',
          300: '#6699CF',
          400: '#3377BF',
          500: '#002868',  // Our base blue
          600: '#002053',
          700: '#00183F',
          800: '#00102A',
          900: '#000815',
        },
        secondary: {
          50: '#FFF1F1',
          100: '#FFE1E1',
          200: '#FFC7C7',
          300: '#FFA3A3',
          400: '#FF7A7A',
          500: '#C41E3A',  // More sophisticated red
          600: '#A3182F',
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
          500: '#FFB612',  // Our yellow
          600: '#CC9200',
          700: '#996E00',
          800: '#664900',
          900: '#332500',
        },
      },
    },
  },
  plugins: [],
} 