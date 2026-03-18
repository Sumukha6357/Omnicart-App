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
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          accent: "var(--brand-accent)",
        },
        bg: {
          page: "var(--bg-page)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)",
        },
        border: {
          soft: "var(--border-soft)",
          strong: "var(--border-strong)",
        },
      },
      borderRadius: {
        card: "24px", /* Refined Masterwork Radii */
        pill: "999px",
        bento: "32px",
      },
      boxShadow: {
        card: "0 2px 4px oklch(0 0 0 / 0.02), 0 8px 16px oklch(0 0 0 / 0.02)",
        "card-hover": "0 20px 40px oklch(0 0 0 / 0.08), 0 1px 1px oklch(1 0 0 / 0.1)",
        "titanium-depth": "0 1px 1px oklch(0 0 0 / 0.05), 0 4px 8px oklch(0 0 0 / 0.05), 0 12px 24px oklch(0 0 0 / 0.05)",
        "luminous-glow": "0 0 20px oklch(var(--brand-primary) / 0.15)",
        "brand-primary": "0 4px 14px oklch(var(--brand-primary) / 0.2)",
      },
      animation: {
        "float-parallax": "float 8s ease-in-out infinite",
        "haptic-pop": "pop 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "shimmer-slide": "shimmer 2.5s linear infinite",
        "pulse-luminous": "pulse-luminous 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(0.5deg)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.025)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-luminous": {
          "0%, 100%": { opacity: 0.8, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.02)" },
        }
      }
    },
  },
  plugins: [],
}
