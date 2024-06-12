import { type BaseLayoutProps } from "fumadocs-ui/layout";

// basic configuration here
export const baseOptions: Omit<BaseLayoutProps, "children"> = {
  nav: {
    title: "GitRover",
    githubUrl: "https://github.com/ToastedDev/gitrover",
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
    },
  ],
};
