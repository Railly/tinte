import type { Metadata } from "next";
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";

export const metadata: Metadata = {
  title: "Best Ray.so Alternatives for Code Screenshots (2026) | Ray",
  description:
    "Looking for Ray.so alternatives with more themes and an API? Compare Ray by Tinte (500+ themes, free API), Snappify, Carbon.now.sh, and more.",
  keywords: [
    "ray.so alternative",
    "ray.so alternatives",
    "code screenshot tool",
    "beautiful code screenshots",
    "code to image",
    "raycast code screenshots",
  ],
  alternates: {
    canonical: "/alternatives/rayso",
  },
  openGraph: {
    title: "Best Ray.so Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Looking for Ray.so alternatives with more themes and an API? Compare Ray by Tinte (500+ themes, free API), Snappify, Carbon.now.sh, and more.",
    url: "https://ray.tinte.dev/alternatives/rayso",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Ray.so Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Looking for Ray.so alternatives with more themes and an API?",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many themes does ray.so have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ray.so offers 17 built-in themes. For comparison, Ray by Tinte offers 500+ themes and Carbon.now.sh has around 29.",
      },
    },
    {
      "@type": "Question",
      name: "Does ray.so have an API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, ray.so does not offer an API. Ray by Tinte provides a free REST API at ray.tinte.dev/api/v1/screenshot with 60 requests per minute and no authentication required.",
      },
    },
    {
      "@type": "Question",
      name: "Can ray.so export to SVG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, ray.so only exports to PNG. Ray by Tinte supports PNG, SVG, and clipboard copy.",
      },
    },
    {
      "@type": "Question",
      name: "Is ray.so open source?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, ray.so is closed source. Open-source alternatives include Ray by Tinte and Carbon.now.sh.",
      },
    },
  ],
};

const toc = [
  { id: "comparison", label: "Comparison" },
  { id: "ray-by-tinte", label: "Ray by Tinte" },
  { id: "snappify", label: "Snappify" },
  { id: "carbon", label: "Carbon.now.sh" },
  { id: "chalk-ist", label: "chalk.ist" },
  { id: "faq", label: "FAQ" },
];

const tools = [
  { feature: "Themes", ray: "500+", rayso: "17", carbon: "~29", snappify: "~50" },
  { feature: "Languages", ray: "16", rayso: "50+", carbon: "~75", snappify: "90+" },
  { feature: "Export", ray: "PNG, SVG, Clipboard", rayso: "PNG", carbon: "PNG, SVG", snappify: "PNG, SVG, PDF, GIF" },
  { feature: "API", ray: "Free (60 req/min)", rayso: "No", carbon: "No", snappify: "Paid only" },
  { feature: "AI skill", ray: "Claude, Cursor", rayso: "No", carbon: "No", snappify: "No" },
  { feature: "Price", ray: "Free", rayso: "Free", carbon: "Free", snappify: "$0-32/mo" },
  { feature: "Open source", ray: "Yes", rayso: "No", carbon: "Yes", snappify: "No" },
  { feature: "Status", ray: "Active", rayso: "Active", carbon: "Dormant", snappify: "Active" },
];

export default function RaysoAlternativesPage() {
  return (
    <ContentLayout toc={toc}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/alternatives/carbon"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Also: Carbon alternatives →
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Best Ray.so Alternatives (2026)
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Ray.so by Raycast is clean and well-designed, but limited to 17 themes,
          PNG-only export, no API, and no AI integration.
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
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">ray.so</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Carbon</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Snappify</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <td className="py-2.5 px-4 text-muted-foreground">{row.feature}</td>
                  <td className="py-2.5 px-4 font-medium">{row.ray}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.rayso}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.carbon}</td>
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
          500+ themes, free REST API (60 req/min, no auth), native AI assistant support for
          Claude Code and Cursor. Open source and actively maintained.
        </p>
        <p className="text-sm text-muted-foreground/70 mb-3">
          Honest weakness: 16 languages vs ray.so's 50+. If you need a niche language, ray.so may be better.
        </p>
        <Link href="/" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Try Ray by Tinte →
        </Link>
      </section>

      <section id="snappify" className="mb-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-3">2. Snappify</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Most feature-rich option. Animations, VS Code plugin, PNG/SVG/PDF/GIF/MP4 export.
          API and team features on paid plans ($10+/mo).
        </p>
        <a href="https://snappify.com" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Visit Snappify →
        </a>
      </section>

      <section id="carbon" className="mb-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-3">3. Carbon.now.sh</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Pioneer of the space. 35.9K GitHub stars, open source, ~75 languages.
          Dormant since December 2024.
        </p>
        <a href="https://carbon.now.sh" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Visit Carbon →
        </a>
      </section>

      <section id="chalk-ist" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-3">4. chalk.ist</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Different approach — Markdown-based code screenshots. Free, minimal. No API.
        </p>
        <a href="https://chalk.ist" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
          Visit chalk.ist →
        </a>
      </section>

      <section id="faq" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-6">FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-1.5">How many themes does ray.so have?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              17 built-in themes. Ray by Tinte has 500+.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1.5">Does ray.so have an API?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No. Ray by Tinte has a free REST API at{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">/api/v1/screenshot</code>{" "}
              with 60 req/min, no auth.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1.5">Can ray.so export to SVG?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No, PNG only. Ray by Tinte supports PNG, SVG, and clipboard.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1.5">Is ray.so open source?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No. Open-source alternatives: Ray by Tinte and Carbon.now.sh.
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
