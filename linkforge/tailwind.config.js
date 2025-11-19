/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6C5CE7",
          dark: "#4B41A6",
          neon: "#20C6B7"
        }
      }
    }
  },
  plugins: []
};

