import Link from "next/link";
import { Suspense } from "react";
import { GithubStars } from "@/components/github-stars";
import { TinteLogo } from "@/components/logos/tinte";

function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="hidden lg:block sticky top-20 w-48 shrink-0 self-start">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        On this page
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors block leading-snug"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ContentLayout({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc?: { id: string; label: string }[];
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-12">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <TinteLogo className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="text-sm font-mono font-semibold tracking-tight">
                ray.tinte.dev
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/alternatives/carbon"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Alternatives
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Suspense>
              <GithubStars />
            </Suspense>
            <a
              href="https://vercel.com/oss"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://vercel.com/oss/program-badge.svg"
                alt="Vercel OSS Program"
                className="h-5"
              />
            </a>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-16 flex gap-16">
        <article className="min-w-0 flex-1">{children}</article>
        {toc && toc.length > 0 && <TableOfContents items={toc} />}
      </div>
    </div>
  );
}
