/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.tsx"],
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
