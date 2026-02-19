import type { Metadata } from "next";
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";

export const metadata: Metadata = {
  title: "Code Screenshot API - Free REST API | Ray by Tinte",
  description:
    "Generate beautiful code screenshots programmatically. Free REST API with 500+ themes, 16 languages, PNG output. No authentication required. 60 requests per minute.",
  keywords: [
    "code screenshot API",
    "programmatic code screenshots",
    "code to image API",
    "code screenshot REST API",
    "automated code screenshots",
  ],
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Code Screenshot API - Free REST API | Ray by Tinte",
    description:
      "Generate beautiful code screenshots programmatically. Free REST API with 500+ themes, 16 languages, PNG output.",
    url: "https://ray.tinte.dev/docs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Screenshot API - Free REST API | Ray by Tinte",
    description:
      "Generate beautiful code screenshots programmatically. Free REST API with 500+ themes, 16 languages, PNG output.",
  },
};

const toc = [
  { id: "quick-start", label: "Quick Start" },
  { id: "parameters", label: "Parameters" },
  { id: "languages", label: "Languages" },
  { id: "themes", label: "Themes" },
  { id: "examples", label: "Code Examples" },
  { id: "ai-integration", label: "AI Integration" },
  { id: "rate-limits", label: "Rate Limits" },
];

const languages = [
  "TSX",
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "HTML",
  "CSS",
  "JSON",
  "Bash",
  "SQL",
  "Java",
  "C++",
  "Ruby",
  "Swift",
  "Kotlin",
];

const params = [
  { name: "code", type: "string", required: true, default: "-", desc: "The source code to render" },
  { name: "language", type: "string", required: false, default: '"tsx"', desc: "Syntax highlighting language" },
  { name: "theme", type: "string", required: false, default: '"one-hunter"', desc: "Theme slug or inline TinteBlock" },
  { name: "mode", type: '"dark" | "light"', required: false, default: '"dark"', desc: "Color scheme" },
  { name: "padding", type: "number", required: false, default: "32", desc: "Outer padding in px (0-256)" },
  { name: "fontSize", type: "number", required: false, default: "14", desc: "Font size in px (8-32)" },
  { name: "lineNumbers", type: "boolean", required: false, default: "true", desc: "Show line numbers" },
  { name: "title", type: "string", required: false, default: '""', desc: "Window title bar text" },
  { name: "background", type: "string", required: false, default: '"midnight"', desc: "Gradient preset or hex color" },
  { name: "scale", type: "number", required: false, default: "2", desc: "Resolution multiplier (1-4)" },
];

export default function DocsPage() {
  return (
    <ContentLayout toc={toc}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebAPI",
            name: "Ray Code Screenshot API",
            url: "https://ray.tinte.dev/api/v1/screenshot",
            description:
              "Generate beautiful code screenshots programmatically with 500+ themes",
            documentation: "https://ray.tinte.dev/docs",
            provider: {
              "@type": "Organization",
              name: "Tinte",
              url: "https://tinte.dev",
            },
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground mb-2">API Reference</p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Code Screenshot API
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Generate beautiful code screenshots programmatically.
          Free, no authentication required.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          POST
        </span>
        <code className="text-sm text-muted-foreground font-mono">
          /api/v1/screenshot
        </code>
      </div>

      <section id="quick-start" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Quick Start</h2>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-mono text-muted-foreground">bash</span>
          </div>
          <pre className="p-4 font-mono text-[13px] leading-relaxed text-foreground/80 overflow-x-auto">
{`curl -X POST https://ray.tinte.dev/api/v1/screenshot \\
  -H 'Content-Type: application/json' \\
  -d '{
    "code": "console.log(\\"Hello, World!\\")",
    "language": "javascript",
    "theme": "one-hunter"
  }' -o screenshot.png`}
          </pre>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Returns a PNG image. The response Content-Type is <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">image/png</code>.
        </p>
      </section>

      <section id="parameters" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Parameters</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Default</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p) => (
                <tr key={p.name} className="border-b border-border last:border-0">
                  <td className="py-2.5 px-4">
                    <code className="font-mono text-[13px]">{p.name}</code>
                    {p.required && (
                      <span className="ml-1.5 text-[10px] font-medium text-orange-400">required</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[13px] text-muted-foreground">{p.type}</td>
                  <td className="py-2.5 px-4 font-mono text-[13px] text-muted-foreground">{p.default}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Background presets: <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">midnight</code>{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">sunset</code>{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">ocean</code>{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">forest</code>{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">ember</code>{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">steel</code>{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">aurora</code>{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">none</code>
        </p>
      </section>

      <section id="languages" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Supported Languages</h2>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex px-2.5 py-1 rounded-md border border-border bg-muted/30 text-[13px] font-mono text-muted-foreground"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>

      <section id="themes" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Themes</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Choose from 500+ themes. Browse the full collection at{" "}
          <a
            href="https://tinte.dev/themes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            tinte.dev/themes
          </a>.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pass any theme slug as the{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">theme</code>{" "}
          parameter, or provide an inline TinteBlock object for custom themes.
        </p>
      </section>

      <section id="examples" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-6">Code Examples</h2>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">JavaScript / Node.js</h3>
        <div className="rounded-lg border border-border bg-card overflow-hidden mb-8">
          <div className="flex items-center px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-mono text-muted-foreground">javascript</span>
          </div>
          <pre className="p-4 font-mono text-[13px] leading-relaxed text-foreground/80 overflow-x-auto">
{`const res = await fetch("https://ray.tinte.dev/api/v1/screenshot", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: 'console.log("Hello")',
    language: "javascript",
    theme: "one-hunter",
  }),
});
const blob = await res.blob();`}
          </pre>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Python</h3>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-mono text-muted-foreground">python</span>
          </div>
          <pre className="p-4 font-mono text-[13px] leading-relaxed text-foreground/80 overflow-x-auto">
{`import requests

res = requests.post("https://ray.tinte.dev/api/v1/screenshot", json={
    "code": "print('Hello')",
    "language": "python",
    "theme": "one-hunter",
})
with open("screenshot.png", "wb") as f:
    f.write(res.content)`}
          </pre>
        </div>
      </section>

      <section id="ai-integration" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-4">AI Agent Integration</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Ray works natively with Claude Code, Cursor, and 40+ AI agents
          via the skills protocol.
        </p>
        <div className="rounded-lg border border-border bg-card overflow-hidden mb-4">
          <div className="flex items-center px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-mono text-muted-foreground">terminal</span>
          </div>
          <pre className="p-4 font-mono text-[13px] leading-relaxed text-foreground/80">
            npx skills add Railly/tinte
          </pre>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Once installed, ask your AI assistant to take a code screenshot.
        </p>
      </section>

      <section id="rate-limits" className="mb-16 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Rate Limits</h2>
        <div className="rounded-lg border border-border p-4 bg-muted/10">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-medium">60 requests / minute</span>
            <span className="text-xs text-muted-foreground">per IP address</span>
          </div>
          <p className="text-sm text-muted-foreground">
            No authentication required. Check usage at{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">GET /api/v1/ratelimit-status</code>
          </p>
        </div>
      </section>

      <div className="flex gap-3 pt-8 border-t border-border">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try it now
        </Link>
        <Link
          href="/alternatives/carbon"
          className="inline-flex items-center justify-center h-9 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted/30 transition-colors"
        >
          View alternatives
        </Link>
      </div>
    </ContentLayout>
  );
}
