/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#126E66',
        'brand-gray-dark': '#212A31',
        'brand-gray-neutral': '#2E3944',
        'brand-gray-light': "#748D92",
        'brand-gray-lightest': "#D4D9D5"
      }
    },
  },
  plugins: [],
}

