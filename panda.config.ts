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
      bg: { base: "white", _dark: "#2c2c2c" },
    },
  },
});
