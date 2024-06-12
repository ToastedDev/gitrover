import { pageTree } from "../source";
import { DocsLayout } from "fumadocs-ui/layout";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={pageTree} nav={{ enabled: false }}>
      {children}
    </DocsLayout>
  );
}
