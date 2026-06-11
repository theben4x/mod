import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // סדר קריטי: Geist האמיתי (לטינית) → Heebo (עברית) → Geist Fallback (Arial).
        // חובה ש-Heebo יקדים את "GeistSans Fallback" — אחרת Arial (שיש בו עברית)
        // חוטף את האותיות העבריות לפני ש-Heebo מקבל הזדמנות.
        sans: ["GeistSans", "var(--font-heebo)", '"GeistSans Fallback"', "system-ui", "sans-serif"],
        // פונט עברית מפורש לשימוש ממוקד (כותרות עבריות וכו')
        heebo: ["var(--font-heebo)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        elevated: "hsl(var(--elevated) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        subtle: "hsl(var(--subtle) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          soft: "hsl(var(--accent-soft) / <alpha-value>)",
        },
        accent2: {
          DEFAULT: "hsl(var(--accent-2) / <alpha-value>)",
          soft: "hsl(var(--accent-2-soft) / <alpha-value>)",
        },
        win: "hsl(var(--win) / <alpha-value>)",
      },
      borderColor: {
        DEFAULT: "hsl(var(--border) / <alpha-value>)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 hsl(0 0% 0% / 0.04), 0 4px 16px -4px hsl(0 0% 0% / 0.06)",
        card: "0 1px 0 0 hsl(var(--border)), 0 12px 40px -12px hsl(0 0% 0% / 0.10)",
        glow: "0 0 0 1px hsl(var(--accent) / 0.4), 0 8px 30px -8px hsl(var(--accent) / 0.35)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-x": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        ticker: "ticker var(--ticker-duration, 45s) linear infinite",
        "fade-in": "fade-in 0.5s ease both",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "grow-x": "grow-x 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [typography],
};

export default config;
