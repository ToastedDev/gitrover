import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"InterVariable"', '"Inter"', ...defaultTheme.fontFamily.sans],
        mono: [
          '"JetBrainsMonoVariabl"',
          '"JetBrains Mono"',
          ...defaultTheme.fontFamily.mono,
        ],
      },
    },
  },
  plugins: [typography],
};
