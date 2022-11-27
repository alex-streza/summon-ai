/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/input.css", "./src/**/*.tsx", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        green: {
          500: "#63DEC7",
          600: "#39D5B8",
        },
        gray: {
          500: "#444444",
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
