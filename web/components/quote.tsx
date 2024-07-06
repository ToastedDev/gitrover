import Image from "next/image";
import type { ReactNode } from "react";

export function Quote({
  children,
  author,
}: {
  children: ReactNode;
  author: {
    name: string;
    handle: string;
    href: string;
    avatar: string;
  };
}) {
  return (
    <blockquote className="not-prose rounded-lg border bg-card p-4 text-card-foreground shadow-md flex flex-col gap-2">
      {children}
      <div className="flex items-center gap-2 not-italic">
        <Image
          src={author.avatar}
          alt={`${author.name}'s Avatar`}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="mt-1">
          <p className="text-lg font-medium leading-none">{author.name}</p>
          <a
            href={author.href}
            target="_blank"
            className="text-sm text-primary hover:opacity-80 transition-opacity underline-offset-2"
          >
            {author.handle}
          </a>
        </div>
      </div>
    </blockquote>
  );
}
