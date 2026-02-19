import Link from "next/link";
import { Suspense } from "react";
import { RayEditor } from "@/components/ray-editor";
import { GithubStars } from "@/components/github-stars";
import { TinteLogo } from "@/components/logos/tinte";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ray by Tinte",
  url: "https://ray.tinte.dev",
  description:
    "Create and share beautiful code screenshots with 500+ themes. Free API, Claude Code skill, and 16 languages.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Person",
    name: "Railly Hugo",
    url: "https://raillyhugo.com",
  },
  featureList: [
    "500+ syntax highlighting themes",
    "16 programming languages",
    "Export to PNG and SVG",
    "Copy to clipboard",
    "REST API for programmatic screenshots",
    "Claude Code skill integration",
    "Custom gradient backgrounds",
    "Line numbers toggle",
    "Theme extraction from images",
  ],
};

export default function Home() {
  return (
    <div className="flex flex-col h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="flex items-center justify-between px-5 h-12 shrink-0 border-b">
        <div className="flex items-center gap-2.5">
          <a
            href="https://tinte.railly.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Powered by Tinte"
          >
            <TinteLogo className="size-5" />
          </a>
          <h1 className="text-sm font-mono font-semibold tracking-tight text-foreground">
            ray.tinte.dev
          </h1>
          <nav className="hidden sm:flex items-center gap-3 ml-3">
            <Link href="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/alternatives/carbon" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Alternatives
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <GithubStars />
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
      </header>
      <main className="flex-1 min-h-0">
        <Suspense>
          <RayEditor />
        </Suspense>
      </main>
    </div>
  );
}
