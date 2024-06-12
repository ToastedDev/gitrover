import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Layout as FumadocsLayout } from "fumadocs-ui/layout";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { baseOptions } from "./layout.config";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <RootProvider>
          <FumadocsLayout {...baseOptions}>{children}</FumadocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
