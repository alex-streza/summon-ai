/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-eb-garamond)"],
      },
      colors: {
        gray: {
          50: "#fbfbfb",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#777777",
          700: "#343434",
          800: "#202020",
          900: "#1a1a1a",
        },
        green: {
          500: "#63dec7",
        },
      },
      fontSize: {
        xxs: "11px",
        "6xl": "5.5rem",
        "7xl": "7.5rem",
        "8xl": "9.25rem",
      },
      borderRadius: {
        none: "0",
        xs: "0.25rem",
        sm: "0.3125rem",
        default: "0.375rem",
        lg: "0.5rem",
        xl: "1.125rem",
        full: "9999px",
      },
    },
  },
  safelist: ["from-bg-gray-900", " to-bg-gray-700", "bg-gradient-to-br"],
  plugins: [require("tailwind-scrollbar")],
};
