import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), react()],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            class: "heading-link",
          },
          behavior: "wrap",
        },
      ],
    ],
    shikiConfig: {
      theme: "rose-pine",
      wrap: true,
    },
  },
});
