import { type BaseLayoutProps } from "fumadocs-ui/layout";

// basic configuration here
export const baseOptions: Omit<BaseLayoutProps, "children"> = {
  nav: {
    title: "My App",
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
  ],
};
