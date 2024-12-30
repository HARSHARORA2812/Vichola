/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#c0a5c5', // Add custom color
        'custom-pink': '#BE95C4', // Add custom color
        'custom-blue': '#342368', // Add custom color
      },
    },
  },
  plugins: [],
}