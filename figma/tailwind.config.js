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
          400: "#525252",
          500: "#444444",
        },
      },
    },
  },
  variants: {
    opacity: ["group-hover"],
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
