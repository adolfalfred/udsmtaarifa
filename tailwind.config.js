/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#191819",
        },
        foreground: {
          light: "#11181c",
          dark: "#ecedee",
        },
        divider: {
          light: "rgba(17, 17, 17, 0.15)",
          dark: "rgba(255, 255, 255, 0.15)",
        },
        focus: {
          light: "#006fee",
          dark: "#006fee",
        },
        content1: {
          light: "#ffffff",
          dark: "#18181b",
        },
        content2: {
          light: "#f4f4f5",
          dark: "#27272a",
        },
        content3: {
          light: "#e4e4e7",
          dark: "#3f3f46",
        },
        content4: {
          light: "#d4d4d8",
          dark: "#52525b",
        },
        default: {
          light: "#d4d4d8",
          dark: "#3f3f46",
        },
        primary: {
          light: "#006fee",
          dark: "#006fee",
        },
        secondary: {
          light: "#7828c8",
          dark: "#9353d3",
        },
        success: {
          light: "#17c964",
          dark: "#17c964",
        },
        warning: {
          light: "#f5a524",
          dark: "#f5a524",
        },
        danger: {
          light: "#f31260",
          dark: "#f31260",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
