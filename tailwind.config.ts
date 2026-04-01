import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7f2",
          100: "#e9eedf",
          500: "#6e8b3d",
          700: "#4d6429",
          900: "#2e3e17",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
