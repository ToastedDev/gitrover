import { type BaseLayoutProps, type DocsLayoutProps } from "fumadocs-ui/layout";
import { pageTree } from "@/app/source";
import Image from "next/image";
import Logo from "@/public/logo.png";

// shared configuration
export const baseOptions: BaseLayoutProps = {
  githubUrl: "https://github.com/ToastedDev/gitrover",
  nav: {
    title: (
      <div className="flex items-center gap-1.5">
        <Image src={Logo} alt="GitRover Logo" width={24} height={24} />
        <span className="font-medium max-md:[header_&]:hidden">GitRover</span>
      </div>
    ),
  },
  links: [],
};

// docs layout configuration
export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: pageTree,
};
