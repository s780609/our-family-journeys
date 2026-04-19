import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-dark": "var(--paper-dark)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        ocean: "var(--ocean)",
        "ocean-deep": "var(--ocean-deep)",
        coral: "var(--coral)",
        "coral-soft": "var(--coral-soft)",
        sun: "var(--sun)",
        leaf: "var(--leaf)",
        rule: "var(--rule)",
        "card-bg": "var(--card-bg)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        hand: ["var(--font-hand)"],
      },
    },
  },
  plugins: [],
};
export default config;
