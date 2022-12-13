/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "7xl": "7.5rem",
        "8xl": "9.25rem",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-eb-garamond)'],
      },
    },
  },
  plugins: [],
};
