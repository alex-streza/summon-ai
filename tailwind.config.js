/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/input.css", "./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        green: {
          500: "#63DEC7",
          600: "#39D5B8",
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
