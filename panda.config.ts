import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    "./app/routes/**/*.{ts,tsx,js,jsx}",
    "./app/components/**/*.{ts,tsx,js,jsx}",
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fonts: {
          body: { value: "Inter, system-ui, sans-serif" },
        },
        colors: {
          primary: { value: "#6366f1" },
          'panel-bg': { value: "#ffffff" },
        },
        shadows: {
          card: {value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }
        }
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
  globalCss: {
    html: {
      h: "full",
    },
    body: {
      bg: { base: "#f3f4f6", _dark: "#2c2c2c" },
    },
    h1: {
      fontSize: "2xl",
      fontWeight: "bold",
      color: "primary",
      marginBottom: "16px",
    },
    h2: {
      fontSize: "xl",
      fontWeight: "bold",
      marginBottom: "16px",
    },
  },
});
