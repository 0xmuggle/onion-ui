/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	// daisyui: {
  //   themes: [
  //     {
	// 			mytheme: {
	// 				"primary": "#f3c9ff",
	// 			},
	// 		},
  //   ],
  // }
}
