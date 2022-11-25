/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/input.css", "./src/**/*.tsx"],
  theme: {
    green: {
      DEFAULT: "#63DEC7",
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
