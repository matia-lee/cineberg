/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#141414",
        blue: {
          DEFAULT: "#4A6FA5", // Primary blue
          light: "#A3BFD9", // Secondary blue
          dark: "#1E3A5F", // Hover blue
        },
        gray: {
          DEFAULT: "#8E8E8E", // Primary gray
          light: "#B0B0B0", // Light gray
          medium: "#6D6D6D", // Medium gray
          dark: "#505050", // Dark gray
        },
        accent: {
          aqua: "#77C4D3",
          teal: "#537C8E",
        },
      },
      fontFamily: {
        roboto: ['"Roboto Slab"', "serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
        raleway: ['"Raleway"', "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
