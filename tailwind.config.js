/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        'brand-secondary': {
          DEFAULT: '#F472B6',
          light: '#F9A8D4',
          dark: '#EC4899',
        },
        'teal-light': 'teal-100',
        'blue-light': 'blue-100',
      }
    },
  },
  plugins: [],
}

