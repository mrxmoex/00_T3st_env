/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#0b0d0c",
          900: "#121614",
          800: "#1a201c",
          700: "#243028",
          600: "#334038",
        },
        copper: {
          400: "#d4a574",
          500: "#c4894a",
          600: "#a66d32",
        },
        plant: {
          400: "#8fa67a",
          500: "#6d8a56",
        },
        animal: {
          400: "#c47a6a",
          500: "#a85a4a",
        },
      },
    },
  },
  plugins: [],
};
