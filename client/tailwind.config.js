/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#117828",
          600: "#066319",
          700: "#044511",
        },
      },
    },
  },
  plugins: [],
};
