/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      text: "#eefcf1",
      bg: {
        500: "#5f5f72",
        600: "#282e34",
        700: "#252533",
        800: "#1b1b25",
        900: "#14141e",
        950: "#090911",
      },
      accent: "#f17365",
      rose: "#da6674ff",
      primary: "#b04567",
      "background-accent": {
        50: "#f6eef7",
        100: "#ecddee",
        200: "#d9bbdd",
        300: "#c698cd",
        400: "#b476bc",
        500: "#a154ab",
        600: "#814389",
        700: "#603267",
        800: "#402244",
        900: "#201122",
        950: "#100811",
      },
      secondary: "#232d58",
    },
  },
  plugins: [],
};
