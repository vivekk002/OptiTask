/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "var(--bg)",
          dark: "var(--bg)",
        },
        primary: {
          light: "#f59e0b", // Amber 500
          dark: "#fbbf24", // Amber 400
        },
        secondary: {
          light: "#334155", // Slate 700
          dark: "#94a3b8", // Slate 400
        },
        accent: {
          teal: "#0d9488",
          rose: "#e11d48",
          amber: "#d97706",
          green: "#059669",
        },
      },
      boxShadow: {
        ultra: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        premium: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
