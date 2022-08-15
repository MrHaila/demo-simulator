/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      olive: '#606c38',
      kombu: '#283618',
      cornsilk: '#fefae0',
      earth: '#dda15e',
      liver: '#bc6c25',
      gray: colors.gray,
      neutral: colors.neutral,
    }
  },
  plugins: [],
}
