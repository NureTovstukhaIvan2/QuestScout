/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        zinc: {
          950: "#1a1a1a",
          900: "#262626",
          800: "#333333",
        },
        orange: {
          600: "#ea580c",
          700: "#c2410c",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
