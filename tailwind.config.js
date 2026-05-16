/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bsod-blue': '#00469b', // Official Windows 10/11 BSOD blue
        'dark-bg': '#0a0a0a',
        'card-bg': '#121212',
      },
      fontFamily: {
        'segoe': ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
