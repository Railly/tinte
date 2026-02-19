import type { Metadata } from "next";
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";

export const metadata: Metadata = {
  title: "Best Carbon.now.sh Alternatives for Code Screenshots (2026) | Ray",
  description:
    "Carbon.now.sh has been dormant since December 2024. Compare the best alternatives: Ray by Tinte (500+ themes, free API), ray.so, Snappify, and more.",
  keywords: [
    "carbon.now.sh alternative",
    "carbon alternative",
    "code screenshot tool",
    "beautiful code screenshots",
    "code to image",
  ],
  alternates: {
    canonical: "/alternatives/carbon",
  },
  openGraph: {
    title: "Best Carbon.now.sh Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Carbon.now.sh has been dormant since December 2024. Compare the best alternatives: Ray by Tinte (500+ themes, free API), ray.so, Snappify, and more.",
    url: "https://ray.tinte.dev/alternatives/carbon",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Carbon.now.sh Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Carbon.now.sh has been dormant since December 2024. Compare the best alternatives.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Carbon.now.sh still maintained?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Carbon.now.sh has not received updates since December 2024. While the tool still works, there are no new features, bug fixes, or security updates being released.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best free alternative to Carbon.now.sh?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ray by Tinte offers 500+ themes, PNG/SVG export, clipboard copy, and a free REST API. It's open source and actively maintained.",
      },
    },
    {
      "@type": "Question",
      name: "Which code screenshot tools have an API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ray by Tinte offers a free REST API at ray.tinte.dev/api/v1/screenshot with 60 requests per minute. Snappify also has an API but only on paid plans.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use code screenshot tools with AI coding assistants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ray by Tinte has a Claude Code and Cursor skill. Install with npx skills add Railly/tinte. No other code screenshot tool offers native AI assistant integration.",
      },
    },
  ],
};

const toc = [
  { id: "comparison", label: "Comparison" },
  { id: "ray-by-tinte", label: "Ray by Tinte" },
  { id: "snappify", label: "Snappify" },
  { id: "ray-so", label: "ray.so" },
  { id: "chalk-ist", label: "chalk.ist" },
  { id: "faq", label: "FAQ" },
];

const tools = [
  { feature: "Themes", ray: "500+", carbon: "~29", rayso: "17", snappify: "~50" },
  { feature: "Languages", ray: "16", carbon: "~75", rayso: "50+", snappify: "90+" },
  { feature: "Export", ray: "PNG, SVG, Clipboard", carbon: "PNG, SVG", rayso: "PNG", snappify: "PNG, SVG, PDF, GIF" },
  { feature: "API", ray: "Free (60 req/min)", carbon: "No", rayso: "No", snappify: "Paid only" },
  { feature: "AI skill", ray: "Claude, Cursor", carbon: "No", rayso: "No", snappify: "No" },
  { feature: "Price", ray: "Free", carbon: "Free", rayso: "Free", snappify: "$0-32/mo" },
  { feature: "Open source", ray: "Yes", carbon: "Yes", rayso: "No", snappify: "No" },
  { feature: "Status", ray: "Active", carbon: "Dormant", rayso: "Active", snappify: "Active" },
];

export default function CarbonAlternativesPage() {
  return (
    <ContentLayout toc={toc}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/alternatives/rayso"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Also: ray.so alternatives →
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Best Carbon.now.sh Alternatives (2026)
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Carbon pioneered beautiful code screenshots and earned 35,900+ GitHub stars.
          But the project has been dormant since December 2024 — no updates, no bug fixes, no API.
        </p>
      </div>

      <section id="comparison" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Comparison</h2>
        <div className="rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Feature</th>
                <th className="text-left py-2.5 px-4 font-medium">Ray by Tinte</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Carbon</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">ray.so</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Snappify</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <td className="py-2.5 px-4 text-muted-foreground">{row.feature}</td>
                  <td className="py-2.5 px-4 font-medium">{row.ray}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.carbon}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.rayso}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.snappify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="ray-by-tinte" className="mb-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-3">1. Ray by Tinte</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          500+ syntax highlighting themes, free REST API (60 req/min), native Claude Code and Cursor skills,
          PNG/SVG/clipboard export. Open source and actively maintained.
        </p>
        <p className="text-sm text-muted-foreground/70 mb-3">
          Honest weakness: 16 languages vs Carbon's ~75. Covers all major languages.
        </p>
        <Link href="/" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Try Ray by Tinte →
        </Link>
      </section>

      <section id="snappify" className="mb-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-3">2. Snappify</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Feature-rich commercial tool with animated snippets, 90+ languages, PNG/SVG/PDF/GIF export.
          API on paid plans only ($10+/mo). Not open source.
        </p>
        <a href="https://snappify.com" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Visit Snappify →
        </a>
      </section>

      <section id="ray-so" className="mb-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-3">3. ray.so</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Raycast's code screenshot tool. Clean interface, 17 themes, 50+ languages. PNG-only, no API,
          no AI integration. Free but closed source.
        </p>
        <a href="https://ray.so" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Visit ray.so →
        </a>
      </section>

      <section id="chalk-ist" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-3">4. chalk.ist</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Markdown-based approach to code screenshots. Free and minimal. No API, limited themes.
        </p>
        <a href="https://chalk.ist" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Visit chalk.ist →
        </a>
      </section>

      <section id="faq" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-6">FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-1.5">Is Carbon.now.sh still maintained?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No updates since December 2024. The tool works but receives no new features or fixes.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1.5">What is the best free alternative?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ray by Tinte — 500+ themes, free API, clipboard copy, open source.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1.5">Which tools have an API?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ray by Tinte (free, 60 req/min) and Snappify (paid plans only).
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1.5">Can I use these with AI coding assistants?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Only Ray by Tinte has native AI integration. Install with{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">npx skills add Railly/tinte</code>.
            </p>
          </div>
        </div>
      </section>

      <div className="flex gap-3 pt-8 border-t border-border">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center justify-center h-9 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted/30 transition-colors"
        >
          Explore the API
        </Link>
      </div>
    </ContentLayout>
  );
}
