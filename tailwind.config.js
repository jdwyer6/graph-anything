/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3B82F6',
        'teal-light': 'teal-100',
        'blue-light': 'blue-100',
      }
    },
  },
  plugins: [],
}

