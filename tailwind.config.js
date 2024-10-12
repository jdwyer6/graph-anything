/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#AB2110',
        'brand-gray-dark': '#41403C',
        'brand-gray-light': "#EDEFEF",
        'brand-orange': "#CF8855"
      }
    },
  },
  plugins: [],
}

