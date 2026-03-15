import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7b8fb2",
          light: "#d5e0e8",
          warm: "#d8cfc4",
          cream: "#fffbeb",
        },
        surface: {
          DEFAULT: "#ffffff",
          mist: "#d5e0e8",
          cream: "#fffbeb",
          warm: "#d8cfc4",
        },
        foreground: {
          DEFAULT: "#2e3a48",
          muted: "#5c6a7a",
          light: "#8a95a5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
