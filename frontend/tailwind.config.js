/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Noto Sans"',
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace"
        ],
      },
      colors: {
        canvas: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        hot: {
          DEFAULT: "var(--hot)",
          hover: "var(--hot-hover)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        // Map legacy color tokens to the new primer system
        richblack: {
          5: "var(--text)",
          25: "var(--text)",
          50: "var(--text-subtle)",
          100: "var(--muted)",
          200: "var(--muted)",
          300: "var(--muted)",
          400: "var(--muted-subtle)",
          500: "var(--muted-dark)",
          600: "var(--border)",
          700: "var(--border)",
          800: "var(--surface-2)",
          900: "var(--bg)",
        },
        richblue: {
          5: "var(--text)",
          25: "var(--text)",
          50: "var(--text-subtle)",
          100: "var(--muted)",
          200: "var(--muted)",
          300: "var(--muted)",
          400: "var(--border)",
          500: "var(--border)",
          600: "var(--surface-2)",
          700: "var(--surface-2)",
          800: "var(--surface)",
          900: "var(--bg)",
        },
      },
      maxWidth: {
        maxContent: "1280px",
        maxContentTab: "650px",
      },
    },
  },
  plugins: [],
};
