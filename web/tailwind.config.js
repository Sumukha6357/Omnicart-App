// tailwind.config.js
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
        surface: {
          page: "#f8fafc",
          card: "#ffffff",
          dark: "#0f172a",
        },
      },
      borderRadius: {
        card: "14px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 6px 18px rgba(15, 23, 42, 0.10), 0 14px 30px rgba(15, 23, 42, 0.08)",
      },
      spacing: {
        18: "4.5rem",
      },
      fontSize: {
        body: ["14px", { lineHeight: "1.55" }],
      },
    },
  },
  plugins: [],
}
